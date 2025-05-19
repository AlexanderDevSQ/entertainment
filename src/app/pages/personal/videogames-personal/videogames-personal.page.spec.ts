import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideogamesPersonalPage } from './videogames-personal.page';

describe('VideogamesPersonalPage', () => {
  let component: VideogamesPersonalPage;
  let fixture: ComponentFixture<VideogamesPersonalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VideogamesPersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
