import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviePersonalPage } from './movie-personal.page';

describe('MoviePersonalPage', () => {
  let component: MoviePersonalPage;
  let fixture: ComponentFixture<MoviePersonalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MoviePersonalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
