import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdithUserFormComponent } from './edith-user-form.component';

describe('EdithUserFormComponent', () => {
  let component: EdithUserFormComponent;
  let fixture: ComponentFixture<EdithUserFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdithUserFormComponent]
    });
    fixture = TestBed.createComponent(EdithUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
