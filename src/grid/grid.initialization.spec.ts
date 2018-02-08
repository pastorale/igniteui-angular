import { Component, ViewChild } from "@angular/core";
import { async, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { DataType } from "../data-operations/data-util";
import { IgxColumnComponent } from "./column.component";
import { IgxGridComponent } from "./grid.component";
import { IgxGridModule } from "./index";

describe("IgxGrid - Grid initialization", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                GridMarkupDeclarationComponent,
                GridAutogeneratedColumnsComponent
            ],
            imports: [IgxGridModule.forRoot()]
        })
        .compileComponents();
    }));

    it("should initialize a grid with columns from markup", () => {
        const fix = TestBed.createComponent(GridMarkupDeclarationComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.instance;

        expect(grid).toBeDefined("Grid initializing through markup failed");
        expect(grid.columnList.length).toEqual(2, "Invalid number of columns initialized");
        expect(grid.rowList.length).toEqual(3, "Invalid number of rows initialized");
    });

    it("should initialize a grid with autogenerated columns", () => {
        const fix = TestBed.createComponent(GridAutogeneratedColumnsComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.instance;

        expect(grid).toBeDefined("Grid initializing through autoGenerate failed");
        expect(grid.columnList.length).toEqual(4, "Invalid number of columns initialized");
        expect(grid.rowList.length).toEqual(3, "Invalid number of rows initialized");
        expect(grid.columnList.first.dataType).toEqual(DataType.Number, "Invalid dataType set on column");
        expect(grid.columnList.find((col) => col.index === 1).dataType)
                .toEqual(DataType.String, "Invalid dataType set on column");
        expect(grid.columnList.find((col) => col.index === 2).dataType)
                .toEqual(DataType.Boolean, "Invalid dataType set on column");
        expect(grid.columnList.last.dataType).toEqual(DataType.Date, "Invalid dataType set on column");
    });

    it("should initialize a grid and emit event on column creation", () => {
        const fix = TestBed.createComponent(GridAutogeneratedColumnsComponent);
        fix.detectChanges();

        expect(fix.componentInstance.columnEventCount).toEqual(4);
    });

    it("should initialize a grid and change column properties during initialization", () => {
        const fix = TestBed.createComponent(GridAutogeneratedColumnsComponent);
        fix.detectChanges();

        const grid = fix.componentInstance.instance;

        grid.columnList.forEach((column) => {
            expect(column.filterable).toEqual(true);
            expect(column.sortable).toEqual(true);
        });
    });
});

@Component({
    template: `
        <igx-grid [data]="data">
            <igx-column field="ID"></igx-column>
            <igx-column field="Name"></igx-column>
        </igx-grid>
    `
})
export class GridMarkupDeclarationComponent {

    public data = [
        { ID: 1, Name: "Johny" },
        { ID: 2, Name: "Sally" },
        { ID: 3, Name: "Tim" }
    ];

    @ViewChild(IgxGridComponent, { read: IgxGridComponent })
    public instance: IgxGridComponent;
}

@Component({
    template: `
        <igx-grid (onColumnInit)="columnCreated($event)" [data]="data" [autoGenerate]="true"></igx-grid>
    `
})
export class GridAutogeneratedColumnsComponent {

    public data = [
        { Number: 1, String: "1", Boolean: true, Date: new Date(Date.now()) },
        { Number: 1, String: "1", Boolean: true, Date: new Date(Date.now()) },
        { Number: 1, String: "1", Boolean: true, Date: new Date(Date.now()) }
    ];

    @ViewChild(IgxGridComponent, { read: IgxGridComponent })
    public instance: IgxGridComponent;

    public columnEventCount = 0;

    public columnCreated(column: IgxColumnComponent) {
        this.columnEventCount++;
        column.filterable = true;
        column.sortable = true;
    }
}