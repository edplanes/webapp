import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { AirframeLimitations } from '../../clients/aircrafts.client';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

type LimitationsNode = {
  name: string;
  value?: string;
  children?: LimitationsNode[];
};

type FlatNode = {
  expandable: boolean;
  name: string;
  level: number;
  value?: string;
};

@Component({
  selector: 'app-limitations-dialog',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, FlexLayoutModule],
  templateUrl: './limitations-dialog.component.html',
  styleUrl: './limitations-dialog.component.scss',
})
export class LimitationsDialogComponent {
  private _transformer = (node: LimitationsNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    value: node.value,
  });

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  datasource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(@Inject(MAT_DIALOG_DATA) data: AirframeLimitations) {
    this.datasource.data = this.toLimitiationNodes(data);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private toLimitiationNodes(data: AirframeLimitations): LimitationsNode[] {
    return [
      {
        name: 'weights',
        children: [
          {
            name: 'Maximum Fuel On Board',
            value: data.weights.maximumFuelOnBoard.toString(),
          },
          {
            name: 'Maximum Landing Weight',
            value: data.weights.maximumLandingWeight.toString(),
          },
          {
            name: 'Maximum Takeoff Weight',
            value: data.weights.maximumTakeoffWeight.toString(),
          },
          {
            name: 'Maximum Zero Fuel Weight',
            value: data.weights.maximumZeroFuelWeight.toString(),
          },
          {
            name: 'Empty Weight',
            value: data.weights.operationalEmptyWeight.toString(),
          },
        ],
      },
    ];
  }
}
