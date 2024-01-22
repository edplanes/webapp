import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { AirframeDefaults } from '../../clients/aircrafts.client';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';

type DefaultsNode = {
  name: string;
  value?: string;
  children?: DefaultsNode[];
};

type FlatNode = {
  expandable: boolean;
  name: string;
  level: number;
  value?: string;
};

@Component({
  selector: 'app-defaults-dialog',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule, FlexLayoutModule],
  templateUrl: './defaults-dialog.component.html',
  styleUrl: './defaults-dialog.component.scss',
})
export class DefaultsDialogComponent {
  private _transformer = (node: DefaultsNode, level: number): FlatNode => ({
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

  constructor(@Inject(MAT_DIALOG_DATA) data: AirframeDefaults) {
    this.datasource.data = this.toLimitiationNodes(data);
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  private toLimitiationNodes(data: AirframeDefaults): DefaultsNode[] {
    return [
      {
        name: 'Cruise True Airspeed',
        value: data.cruiseTAS.toString(),
      },
    ];
  }
}
