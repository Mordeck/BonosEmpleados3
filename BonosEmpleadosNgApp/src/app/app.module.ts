//modulos
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort'; // For sorting, if needed
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { fadeInOut } from './animations/animations';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule, matDatepickerAnimations } from '@angular/material/datepicker';





import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// ...

registerLocaleData(localeEs);


import { AuthInterceptor } from './auth-interceptor';



//servicios
import { DynamicComponentService } from './dynamic-component.service';
import { DashBoardFeederService } from './dash-board-feeder.service';


//componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AdmNavbarComponent } from './adm-navbar/adm-navbar.component';
import { TabComponent } from './tab/tab.component';
import { AdmBonusComponent } from './adm-bonus/adm-bonus.component';
import { DocumentManagerComponent } from './document-manager/document-manager.component';
import { UserManagerComponent } from './user-manager/user-manager.component';
import { DocumentDetailComponent } from './document-detail/document-detail.component';
import { UserManagerButtonComponent } from './user-manager-button/user-manager-button.component';
import { NewUserFormComponent } from './new-user-form/new-user-form.component';
import { UserListComponent } from './user-list/user-list.component';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { BonosComponent } from './bonos/bonos.component';
import { NewDocumentFormComponent } from './new-document-form/new-document-form.component';
import { NewDocActivityFormComponent } from './new-doc-activity-form/new-doc-activity-form.component';
import { DeleteDocumentConfirmComponent } from './delete-document-confirm/delete-document-confirm.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivitiesComponent } from './activities/activities.component';
import { CriteriasComponent } from './criterias/criterias.component';
import { ConfDelActivityComponent } from './conf-del-activity/conf-del-activity.component';
import { NewActCriteriaComponent } from './new-act-criteria/new-act-criteria.component';
import { EvaluDashBoardComponent } from './evalu-dash-board/evalu-dash-board.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { EvaluationsCompletedComponent } from './evaluations-completed/evaluations-completed.component';
import { EditCriteriaComponent } from './edit-criteria/edit-criteria.component';
import { RemoveCriteriaComponent } from './remove-criteria/remove-criteria.component';
import { EditDocumentComponent } from './edit-document/edit-document.component';
import { DeleteDocumentFormComponent } from './delete-document-form/delete-document-form.component';
import { ActivityConditionerComponent } from './activity-conditioner/activity-conditioner.component';
import { AditionalBonusComponent } from './aditional-bonus/aditional-bonus.component';
import { DeductionsComponent } from './deductions/deductions.component';
import { EmployeesComponent } from './employees/employees.component';
import { ManualComponent } from './manual/manual.component';
import { EdithUserFormComponent } from './edith-user-form/edith-user-form.component';
import { BonosViewStyleDocComponent } from './bonos-view-style-doc/bonos-view-style-doc.component';
import { BonosAdminViewStyleDocComponent } from './bonos-adminView-style-doc/bonos-adminView-style-doc.component';
import { ConfirmSaveEvalComponent } from './confirm-save-eval/confirm-save-eval.component';
import { ConfirmSalesBonoComponent } from './confirm-sales-bono/confirm-sales-bono.component';
import { ConfirmbudgetBonoComponent } from './confirmbudget-bono/confirmbudget-bono.component';
import { SalesAndBudgetComponent } from './sales-and-budget/sales-and-budget.component';
import { SalesAditionalsBonusComponent } from './sales-aditionals-bonus/sales-aditionals-bonus.component';
import { SalesFormComponent } from './sales-form/sales-form.component';
import { ExpensesFormComponent } from './expenses-form/expenses-form.component';
import { CriteriaViewEvalComponent } from './criteria-view-eval/criteria-view-eval.component';
import { ConditionViewerComponent } from './condition-viewer/condition-viewer.component';
import { AditionalBonoViewComponent } from './aditional-bono-view/aditional-bono-view.component';
import { AditionalBonoViewCSimpleComponent } from './aditional-bono-view-csimple/aditional-bono-view-csimple.component';
import { DeductionsViewComponent } from './deductions-view/deductions-view.component';
import { DocumentFinalAuthorizationComponent } from './document-final-authorization/document-final-authorization.component';





const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'adminDashboard', component: AdminDashboardComponent },
  { path: 'evaluDashboard', component: EvaluDashBoardComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

export const BACKSERVER = "http://10.20.1.57:4201";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminDashboardComponent,
    SpinnerComponent,
    AdmNavbarComponent,
    TabComponent,
    AdmBonusComponent,
    DocumentManagerComponent,
    UserManagerComponent,
    DocumentDetailComponent,
    UserManagerButtonComponent,
    NewUserFormComponent,
    UserListComponent,
    BonosComponent,
    NewDocumentFormComponent,
    NewDocActivityFormComponent,
    DeleteDocumentConfirmComponent,
    ActivitiesComponent,
    CriteriasComponent,
    ConfDelActivityComponent,
    NewActCriteriaComponent,
    EvaluDashBoardComponent,
    EvaluationComponent,
    EvaluationsCompletedComponent,
    EditCriteriaComponent,
    RemoveCriteriaComponent,
    EditDocumentComponent,
    DeleteDocumentFormComponent,
    ActivityConditionerComponent,
    AditionalBonusComponent,
    DeductionsComponent,
    EmployeesComponent,
    ManualComponent,
    EdithUserFormComponent,
    BonosViewStyleDocComponent,
    ConfirmSaveEvalComponent,
    ConfirmSalesBonoComponent,
    ConfirmbudgetBonoComponent,
    BonosAdminViewStyleDocComponent,
    SalesAndBudgetComponent,
    SalesAditionalsBonusComponent,
    SalesFormComponent,
    ExpensesFormComponent,
    CriteriaViewEvalComponent,
    ConditionViewerComponent,
    AditionalBonoViewComponent,
    AditionalBonoViewCSimpleComponent,
    DeductionsViewComponent,
    DocumentFinalAuthorizationComponent
  ],
  imports: [
    [RouterModule.forRoot(routes)],
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,

  ],
  providers: [
    DynamicComponentService,
    DashBoardFeederService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es-MX' },
    CurrencyPipe
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
