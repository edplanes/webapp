import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardComponent } from './stats-card.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatsCardComponent', () => {
  let component: StatsCardComponent;
  let fixture: ComponentFixture<StatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
