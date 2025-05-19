import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeriePersonalPage } from './serie-personal.page';

describe('SeriePersonalPage', () => {
  let component: SeriePersonalPage;
  let fixture: ComponentFixture<SeriePersonalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriePersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
