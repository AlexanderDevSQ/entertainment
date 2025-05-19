import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesDetailPage } from './games-detail.page';

describe('GamesDetailPage', () => {
  let component: GamesDetailPage;
  let fixture: ComponentFixture<GamesDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
