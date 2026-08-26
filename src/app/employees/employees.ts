import { Component, inject, signal } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { form, FormField } from '@angular/forms/signals';
import { Employee } from '../models/employee';
import { Logout } from '../logout/logout';

@Component({
  selector: 'app-employees',
  imports: [FormField, Logout],
  templateUrl: './employees.html',
  styleUrl: './employees.scss',
})
export class Employees {

  private readonly employeeService = inject(EmployeeService)

  readonly employees = signal<Employee[]>([]);

  readonly editingEmployee = signal<Employee | null>(null);
  readonly isAdding = signal(false);
  readonly editModel = signal({ name: '', department: '' });
  readonly editForm = form(this.editModel);

  private readonly initialLoad = this.refresh();

  private refresh(): void {
    this.employeeService.getEmployees().subscribe(employees => this.employees.set(employees));
  }

  onAdd(): void {
    this.isAdding.set(true);
    this.editModel.set({ name: '', department: '' });
  }

  onEdit(employee: Employee): void {
    this.editingEmployee.set(employee);
    this.editModel.set({ name: employee.name, department: employee.department });
  }

  closeEdit(): void {
    this.editingEmployee.set(null);
    this.isAdding.set(false);
  }

  save(): void {
    const request = this.isAdding()
      ? this.employeeService.addEmployee(this.editModel())
      : this.employeeService.editEmployee({ ...this.editModel(), id: this.editingEmployee()!.id });

    request.subscribe(() => {
      this.refresh();
      this.closeEdit();
    });
  }

  onDelete(employee: Employee): void {
    this.employeeService.deleteEmployee(employee.id!).subscribe(() => {
      this.refresh();
    })
  }

}
