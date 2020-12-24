import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPolicialComponent } from './personal-policial.component';

describe('PersonalPolicialComponent', () => {
  let component: PersonalPolicialComponent;
  let fixture: ComponentFixture<PersonalPolicialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalPolicialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalPolicialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
