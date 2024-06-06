import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { BACKSERVER } from '../app.module';
import { ResourceLoader } from '@angular/compiler';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LoginComponent } from '../login/login.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

interface EmployeeInterface { }

class Employee extends MatTableDataSource<EmployeeInterface>
{
}


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.sass']
})
export class EmployeesComponent
{

  @ViewChild(MatSort) sort: MatSort | null = null;
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;


  empPosition: number = 0;
  empDepartment: number = 0;
  empNum = 0;

  employees = new Employee([]);
  departments: any[] = [];
  positions: any[] = [];
  empName = '';
  searchText: string = '';
  displayedColumns = ['id', 'name', 'position', 'posName'];

  constructor(private _http: HttpClient, private _snack: MatSnackBar)
  {
    this.getDepartments();
    this.getEmployees();
  }

  applyFilter() {

    this.employees.filter = this.searchText.trim().toLowerCase();

  }

  openDialog(row: any, $event: MouseEvent) {
  }

  onHover(row: any) {
  }

  getDepartments() {
    const url = BACKSERVER + '/departments'
    this._http.get(url).subscribe({
      next: (result) => {
        const res: any = result;
        console.log('al solicitar los deparments');
        console.log(res);

        if (res.status == 'success') {
          this.departments = res.data;

        }
        else {
          console.log('No se obtuvieron los departamentos');

        }

      }
    })
  }

  clickOnPosition() {
    if (this.empDepartment == 0) {
      this._snack.open('Debes seleccionar un departamento primero', 'Cerrar', { duration: 5000 })
    }
  }

  getPositions() {
    const url = BACKSERVER + '/positionsByDep'
    this._http.get(url, { params: { departmentId: this.empDepartment } }).subscribe({
      next: (result) => {
        const res: any = result;
        if (res.status == "success") {
          this.positions = res.data;
        }
      }
    })
  }

  saveEmployee() {

    if (this.empName.length < 10) {
      this._snack.open('El nombre debe tener almenos 10 caractéres', 'Cerrar', { duration: 5000 });
      return;
    }

    if (this.empNum == 0) {
      this._snack.open('el número de empleado no debe ser 0', 'Cerrar', { duration: 5000 });
      return;
    }

    const url = BACKSERVER + '/employees';

    this._http.post(url, { empNum: this.empNum, empName: this.empName, empDepartment: this.empDepartment, empPosition: this.empPosition })
      .subscribe({
        next: (result: any) =>
        {
          if (result.status == 'success')
          {
            this._snack.open('Se agrego el empleado correctamente', "Cerrar", { duration: 5000 })
          }
          else
          {
            console.log('Sucedio un error al agregar al empleado');
          }
        },
        error: (error) => {
          console.log("No se pudo ejecutar la peticion");

        }
      })



  }

  getEmployees() {
    const url = BACKSERVER + '/employees'
    this._http.get(url).subscribe({
      next: (result: any) => {
        if (result.status == 'success') {
          this.employees.data = result.data;
          this.employees.sort = this.sort;
          this.employees.paginator = this.paginator;
        }
      }
    })
  }

}
