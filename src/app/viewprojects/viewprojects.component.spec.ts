import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewprojectsComponent } from './viewprojects.component';

describe('ViewprojectsComponent', () => {
  let component: ViewprojectsComponent;
  let fixture: ComponentFixture<ViewprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewprojectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
