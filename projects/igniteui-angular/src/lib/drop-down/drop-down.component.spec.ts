import { Component, ContentChildren, DebugElement, ViewChild, OnInit, ElementRef } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxToggleActionDirective, IgxToggleDirective, IgxToggleModule } from '../directives/toggle/toggle.directive';
import { IgxDropDownItemComponent } from './drop-down-item.component';
import { IgxDropDownComponent, IgxDropDownModule, IgxDropDownItemNavigationDirective } from './drop-down.component';
import { IgxTabsComponent, IgxTabsModule } from '../tabs/tabs.component';

const CSS_CLASS_FOCUSED = 'igx-drop-down__item--focused';
const CSS_CLASS_SELECTED = 'igx-drop-down__item--selected';
const CSS_CLASS_DISABLED = 'igx-drop-down__item--disabled';
const CSS_CLASS_HEADER = 'igx-drop-down__header';
const CSS_CLASS_DROP_DOWN = 'igx-drop-down__list';
const CSS_CLASS_DROP_DOWN_BASE = 'igx-drop-down';
const CSS_CLASS_TOGGLE = 'igx-toggle';

function wrapPromise(callback, resolve, time) {
    return new Promise((res, rej) => {
        return setTimeout(() => {
            callback();
            return res(resolve);
        }, time);
    });
}

describe('IgxDropDown ', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IgxDropDownTestComponent,
                IgxDropDownTestScrollComponent,
                IgxDropDownTestDisabledComponent,
                IgxDropDownTestDisabledAnyComponent,
                IgxDropDownTestEmptyListComponent,
                IgxDropDownWithScrollComponent,
                DoubleIgxDropDownComponent,
                InputWithDropdownDirectiveComponent,
                IgxDropDownInputTestComponent,
                IgxDropDownImageTestComponent,
                IgxDropDownTabsTestComponent
            ],
            imports: [
                IgxDropDownModule,
                BrowserAnimationsModule,
                NoopAnimationsModule,
                IgxToggleModule,
                IgxTabsModule
            ]
        })
            .compileComponents();
    }));

    it('should select item by SPACE/ENTER and click', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const listItems = list.items;
        let targetElement;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        button.click(mockObj);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_FOCUSED))[0];
            expect(currentItem.componentInstance.index).toEqual(0);
            expect(list.collapsed).toEqual(false);
            targetElement = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DROP_DOWN_BASE))[0].parent;
            expect(targetElement).toBeDefined();
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            // targetElement.nativeElement.dispatchEvent(new KeyboardEvent('keydown', mockObj1));
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(1);
            expect(list.selectedItem).toBeFalsy();
            targetElement.triggerEventHandler('keydown.Space', mockObj);
            // targetElement.nativeElement.dispatchEvent(new KeyboardEvent('keydown', mockObj1));
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(list.items[1]);
            expect(list.collapsed).toEqual(true);
            button.click(mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            targetElement = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DROP_DOWN_BASE))[0].parent;
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_SELECTED))[0];
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            targetElement = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DROP_DOWN_BASE))[0].parent;
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            targetElement.triggerEventHandler('keydown.Enter', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.collapsed).toEqual(true);
            expect(list.selectedItem).toEqual(list.items[2]);
            button.click(mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.collapsed).toEqual(false);
            fixture.detectChanges();
            list.items[1].element.nativeElement.click(mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(list.items[1]);
            expect(list.collapsed).toEqual(true);
        });
    }));

    it('should change the selected values indefinitely', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownScroll;
        let targetElement;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(15);
        button.click(mockObj);
        // spyOn(list.items[0], 'onArrowDownKeyDown').and.callThrough();
        // spyOn(list.items[1], 'onSpaceKeyDown').and.callThrough();
        // spyOn(list.items[4], 'onEscapeKeyDown').and.callThrough();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem.componentInstance.index).toEqual(0);
            targetElement = fixture.debugElement.query(By.css('.' + CSS_CLASS_DROP_DOWN_BASE)).parent;
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(1);
            targetElement.triggerEventHandler('keydown.Space', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(listItems[1]);
            document.getElementsByTagName('button')[1].click();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(listItems[4]);
            button.click();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(4);
            targetElement.triggerEventHandler('keydown.Escape', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.collapsed).toEqual(true);
            expect(list.selectedItem).toEqual(listItems[4]);
            // expect(list.items[0].onArrowDownKeyDown).toHaveBeenCalledTimes(1);
            // expect(list.items[1].onSpaceKeyDown).toHaveBeenCalledTimes(1);
            // expect(list.items[4].onEscapeKeyDown).toHaveBeenCalledTimes(1);
            tick();
            return fixture.whenStable();
        }).then(() => {
            tick();
            fixture.detectChanges();
            expect(list.collapsed).toEqual(true);
        });
    }));

    it('Should navigate through the items using Up/Down/Home/End keys', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const listItems = list.items;
        let targetElement;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            targetElement = fixture.debugElement.query(By.css('.' + CSS_CLASS_DROP_DOWN_BASE)).parent;
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(1);
            targetElement.triggerEventHandler('keydown.End', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(3);
            targetElement.triggerEventHandler('keydown.ArrowUp', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(2);
            targetElement.triggerEventHandler('keydown.Home', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(0);
        });
    });

    it('Should support disabled items', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledAnyComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabledAny;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DISABLED))[0];
            expect(currentItem.componentInstance.index).toEqual(2);
            currentItem.triggerEventHandler('click', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[4];
            expect(currentItem.componentInstance.index).toEqual(4);
            currentItem.triggerEventHandler('click', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(list.items[4]);
        });
    }));

    it('Should support header items', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledAnyComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabledAny;
        const listItems = list.items;
        const headerItems = list.headers;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_HEADER))[0];
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance).toEqual(headerItems[0]);
            currentItem.triggerEventHandler('click', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[1];
            currentItem.triggerEventHandler('click', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(list.items[1]);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.collapsed).toEqual(true);
        });
    }));

    it('Should notify when selection has changed', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        spyOn(list.onSelection, 'emit').and.callThrough();
        spyOn(list.onClosed, 'emit').and.callThrough();
        spyOn(fixture.componentInstance, 'onSelection');
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        button.click(mockObj);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const lastListItem = list.items[3].element.nativeElement;
            lastListItem.click({});
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.selectedItem).toEqual(list.items[3]);
            expect(list.onSelection.emit).toHaveBeenCalledTimes(1);
            expect(list.onClosed.emit).toHaveBeenCalledTimes(1);
            expect(fixture.componentInstance.onSelection).toHaveBeenCalledTimes(1);
        });
    }));

    it('Should persist selection through scrolling', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownScroll;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(15);
        button.click(mockObj);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            let currentItem = document.getElementsByClassName(CSS_CLASS_FOCUSED)[0] as HTMLElement;
            currentItem.focus();
            expect(currentItem.innerHTML.trim()).toEqual('Item 1');
            const scrollElement = document.getElementsByClassName(CSS_CLASS_TOGGLE)[0] as HTMLElement;
            scrollElement.scrollTop += 150;
            currentItem = document.getElementsByClassName(CSS_CLASS_FOCUSED)[0] as HTMLElement;
            expect(currentItem.innerHTML.trim()).toEqual('Item 1');
            scrollElement.scrollTop = 0;
            const currentItem2 = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_FOCUSED))[0];
            expect(currentItem2).toBeDefined();
            expect(currentItem2.componentInstance.index).toEqual(0);
        });
    });

    it('Should be able to implement to input anchor', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownInputTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('input')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        spyOn(list.onSelection, 'emit').and.callThrough();
        spyOn(list.onClosed, 'emit').and.callThrough();
        spyOn(fixture.componentInstance, 'onSelection');
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        button.click(mockObj);
        tick();
        fixture.detectChanges();
        const lastListItem = list.items[3].element.nativeElement;
        lastListItem.click({});
        tick();
        fixture.detectChanges();
        expect(list.selectedItem).toEqual(list.items[3]);
        expect(list.onSelection.emit).toHaveBeenCalledTimes(1);
        expect(list.onClosed.emit).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.onSelection).toHaveBeenCalledTimes(1);
    }));

    it('Should be able to implement to image anchor', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownImageTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('img')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        spyOn(list.onSelection, 'emit').and.callThrough();
        spyOn(list.onClosed, 'emit').and.callThrough();
        spyOn(fixture.componentInstance, 'onSelection');
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        button.click(mockObj);
        tick();
        fixture.detectChanges();
        const lastListItem = list.items[3].element.nativeElement;
        lastListItem.click({});
        tick();
        fixture.detectChanges();
        expect(list.selectedItem).toEqual(list.items[3]);
        expect(list.onSelection.emit).toHaveBeenCalledTimes(1);
        expect(list.onClosed.emit).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.onSelection).toHaveBeenCalledTimes(1);
    }));

    it('Should be able to implement to igx-tabs anchor', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTabsTestComponent);
        fixture.detectChanges();
        const tabs = fixture.componentInstance.tabs;
        const list = fixture.componentInstance.dropdown;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        spyOn(list.onSelection, 'emit').and.callThrough();
        spyOn(list.onClosed, 'emit').and.callThrough();
        spyOn(fixture.componentInstance, 'onSelection');
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        tabs.tabs.toArray()[0].nativeTabItem.nativeElement.dispatchEvent(new Event('click', { bubbles: true }));
        tick(300);
        fixture.detectChanges();
        const lastListItem = list.items[3].element.nativeElement;
        lastListItem.click({});
        tick(300);
        fixture.detectChanges();
        expect(list.selectedItem).toEqual(list.items[3]);
        expect(list.onSelection.emit).toHaveBeenCalledTimes(1);
        expect(list.onClosed.emit).toHaveBeenCalledTimes(1);
        expect(fixture.componentInstance.onSelection).toHaveBeenCalledTimes(1);
    }));

    it('Items can be disabled/enabled at runtime', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledAnyComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabledAny;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DISABLED));
            expect(currentItem.length).toEqual(3);
            expect(list.items[4].disabled).toBeFalsy();
            list.items[4].disabled = true;
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DISABLED));
            expect(currentItem.length).toEqual(4);
            expect(list.items[4].disabled).toBeTruthy();
        });
    });

    it('Esc key closes the dropdown and does not change selection', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdown;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        let targetElement;
        spyOn(list.onSelection, 'emit').and.callThrough();
        spyOn(list.onOpening, 'emit').and.callThrough();
        spyOn(list.onOpened, 'emit').and.callThrough();
        spyOn(list.onClosing, 'emit').and.callThrough();
        spyOn(list.onClosed, 'emit').and.callThrough();
        spyOn(fixture.componentInstance, 'onSelection');
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(4);
        button.click(mockObj);
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            targetElement = fixture.debugElement.query(By.css('.' + CSS_CLASS_DROP_DOWN_BASE)).parent;
            // expect(currentItem.componentInstance.index).toEqual(0);
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem).toBeDefined();
            expect(currentItem.componentInstance.index).toEqual(1);
            targetElement.triggerEventHandler('keydown.Escape', mockObj);
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.onOpening.emit).toHaveBeenCalledTimes(1);
            expect(list.onOpened.emit).toHaveBeenCalledTimes(1);
            expect(list.onSelection.emit).toHaveBeenCalledTimes(0);
            fixture.detectChanges();
            expect(list.collapsed).toEqual(true);
            // TODO: should be list.onClose.emit
        });
    }));

    it('Should not change selection when setting it to non-existing item', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownScroll;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(15);
        list.setSelectedItem(0);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(0);
            list.setSelectedItem(-4);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[0].isSelected).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(0);
            list.setSelectedItem(24);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[0].isSelected).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(0);
            list.setSelectedItem(5);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[5].isSelected).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(5);
            // TODO: verify selecting the already selected element is not affecting selection
            list.setSelectedItem(5);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[5].isSelected).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(5);
        });
    });

    it('Home key should select the first enabled item', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(listItems[1].isSelected).toBeFalsy();
            fixture.componentInstance.dropdownDisabled.setSelectedItem(4);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[4].isSelected).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            expect(currentItem.componentInstance.index).toEqual(4);
            currentItem.triggerEventHandler('keydown.Home', jasmine.createSpyObj('w/e', ['stopPropagation', 'preventDefault']));
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[1].isFocused).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem.componentInstance.index).toEqual(1);
        });
    });

    it('End key should select the last enabled item', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        let targetElement;
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            fixture.componentInstance.dropdownDisabled.setSelectedItem(4);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_SELECTED));
            targetElement = fixture.debugElement.query(By.css('.' + CSS_CLASS_DROP_DOWN_BASE)).parent;
            expect(list.items[4].isSelected).toBeTruthy();
            targetElement.triggerEventHandler('keydown.End', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[11].isFocused).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem.componentInstance.index).toEqual(11);
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[11].isFocused).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem.componentInstance.index).toEqual(11);
        });
    });

    it('Key navigation through disabled items', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        let targetElement;
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[0];
            targetElement = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DROP_DOWN_BASE))[0].parent;
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.items[3].isFocused).toBeTruthy();
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[0];
            targetElement.triggerEventHandler('keydown.ArrowUp', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(listItems[1].isFocused).toBeTruthy();
            const currentItem = fixture.debugElement.query(By.css('.' + CSS_CLASS_FOCUSED));
            expect(currentItem.componentInstance.index).toEqual(1);
        });
    });

    it('Change width/height at runtime', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        fixture.componentInstance.dropdownDisabled.width = '80%';
        fixture.componentInstance.dropdownDisabled.height = '400px';
        fixture.componentInstance.dropdownDisabled.id = 'newDD';
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const toggleElement = fixture.debugElement.query(By.css('.' + CSS_CLASS_TOGGLE)).nativeElement;
            expect(toggleElement.style.width).toEqual('80%');
            expect(toggleElement.style.height).toEqual('400px');
            expect(fixture.componentInstance.dropdownDisabled.id).toEqual('newDD');
        });
    });

    it('Disabled items cannot be focused', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        list.items[0].isFocused = true;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(list.items[0].isFocused).toEqual(false);
        });
    });

    it('Disabled items cannot be set selected', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        list.setSelectedItem(0);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(list.items[0].isSelected).toEqual(false);
            button.click();
        });
    });

    it('Clicking a disabled item is not moving the focus', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        let targetElement;
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const list = fixture.componentInstance.dropdownDisabled;
        const listItems = list.items;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        expect(list).toBeDefined();
        expect(list.items.length).toEqual(13);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(list.items[1].isFocused).toEqual(true);
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[0];
            targetElement = fixture.debugElement.queryAll(By.css('.' + CSS_CLASS_DROP_DOWN_BASE))[0].parent;
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.items[3].isFocused).toEqual(true);
            const firstItem = list.items[0].element.nativeElement;
            firstItem.click({});
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.items[3].isFocused).toEqual(true);
            const currentItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[1];
            targetElement.triggerEventHandler('keydown.ArrowDown', mockObj);
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(list.items[4].isFocused).toEqual(true);
        });
    });

    it('Unit: should fire events', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        const componentInstance = fixture.componentInstance;
        fixture.detectChanges();

        spyOn(componentInstance, 'onToggleOpening');
        spyOn(componentInstance, 'onToggleOpened');
        spyOn(componentInstance, 'onToggleClosing');
        spyOn(componentInstance, 'onToggleClosed');

        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const mockObj = jasmine.createSpyObj('mockEvt', ['stopPropagation', 'preventDefault']);
        button.click(mockObj);

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(componentInstance.onToggleOpening).toHaveBeenCalledTimes(1);
            expect(componentInstance.onToggleOpened).toHaveBeenCalledTimes(1);
            button.click({ stopPropagation: () => null });
            tick();
            return fixture.whenStable();
        }).then(() => {
            fixture.detectChanges();
            expect(componentInstance.onToggleClosing).toHaveBeenCalledTimes(1);
            expect(componentInstance.onToggleClosing).toHaveBeenCalledTimes(1);
        });
    }));

    it('Unit: test width/height properties', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.componentInstance.dropdownDisabled.width = '80%';
        fixture.componentInstance.dropdownDisabled.height = '400px';
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(fixture.componentInstance.dropdownDisabled.height).toEqual('400px');
            expect(fixture.componentInstance.dropdownDisabled.width).toEqual('80%');
        });
    });

    it('Unit: items should take focus when allowItemsFocus is set to true', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.componentInstance.dropdown.allowItemsFocus = true;
        button.focus();
        button.click();
        fixture.whenStable().then(() => {
            const focusedItem = fixture.debugElement.queryAll(By.css('.igx-drop-down__item'))[0].nativeElement;
            expect(document.activeElement).toEqual(focusedItem);
            fixture.detectChanges();
        });
    });

    it('Unit: items should not take focus when allowItemsFocus is set to false', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        fixture.componentInstance.dropdown.allowItemsFocus = false;
        button.focus();
        button.click();
        fixture.whenStable().then(() => {
            expect(document.activeElement).toEqual(button);
            fixture.detectChanges();
        });
    });

    it('Unit: selectedItem should return and item when there is selected item', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdownScroll;
        igxDropDown.setSelectedItem(3);
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const selectedItem = igxDropDown.selectedItem;
            expect(selectedItem).toBeTruthy();
            expect(selectedItem.index).toEqual(3);
        });
    });

    it('Unit: selectedItem should return null when there is no selected item', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdownScroll;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const selectedItem = igxDropDown.selectedItem;
            expect(selectedItem).toBeNull();
        });
    });

    it('Unit: should return empty array for items when there are no items', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestEmptyListComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdownEmpty;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const items = igxDropDown.items;
            expect(items).toEqual([]);
        });
    });

    it('Unit: should return all items for items when there are some items', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdown;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const items = igxDropDown.items;
            expect(items).toBeTruthy();
            expect(items.length).toEqual(4);
        });
    });

    it('Unit: should return empty array for headers when there are no header items', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdown;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const headerItems = igxDropDown.headers;
            expect(headerItems).toEqual([]);
        });
    });

    it('Unit: should return all header items for headers when there are some header items', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestDisabledComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdownDisabled;
        button.click();
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            const headerItems = igxDropDown.headers;
            expect(headerItems).toBeTruthy();
            expect(headerItems.length).toEqual(2);
        });
    });

    it('Unit: should open drop down when call open()', () => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        const componentInstance = fixture.componentInstance;
        const igxDropDown = componentInstance.dropdown;
        fixture.detectChanges();
        expect(igxDropDown.collapsed).toEqual(true);
        igxDropDown.open();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(igxDropDown.collapsed).toEqual(false);
        });
    });

    it('Unit: should close drop down when call close()', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownTestComponent);
        const componentInstance = fixture.componentInstance;
        const igxDropDown = componentInstance.dropdown;
        fixture.detectChanges();
        expect(igxDropDown.collapsed).toEqual(true);
        igxDropDown.toggle();
        tick();

        fixture.detectChanges();
        expect(igxDropDown.collapsed).toEqual(false);

        igxDropDown.toggle();
        tick();

        fixture.detectChanges();
        expect(igxDropDown.collapsed).toEqual(true);
    }));

    it('#1663 drop down flickers on open', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownWithScrollComponent);
        fixture.detectChanges();
        const button = fixture.debugElement.query(By.css('button')).nativeElement;
        const igxDropDown = fixture.componentInstance.dropdownScroll;
        button.click();
        igxDropDown.open();
        tick();
        expect((<any>igxDropDown).toggleDirective.element.scrollTop).toEqual(44);
    }));

    it('Should select item and close on Enter keydown', fakeAsync(() => {
        const fixture = TestBed.createComponent(IgxDropDownWithScrollComponent);
        fixture.detectChanges();
        const mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
        const igxDropDown = fixture.componentInstance.dropdownScroll;
        igxDropDown.toggle();
        tick();
        expect(igxDropDown.collapsed).toEqual(false);
        expect(igxDropDown.selectedItem).toEqual(null);
        tick();
        const dropdownHandler = fixture.debugElement.query(By.css(CSS_CLASS_DROP_DOWN_BASE));
        dropdownHandler.triggerEventHandler('keydown.Enter', mockEvent);
        tick();
        expect(igxDropDown.collapsed).toEqual(true);
        expect(igxDropDown.selectedItem).toEqual(igxDropDown.items[0]);
        expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    }));

    it('should keep selection per instance', fakeAsync(() => {
        const fixture = TestBed.createComponent(DoubleIgxDropDownComponent);
        fixture.detectChanges();
        const mockEvent = jasmine.createSpyObj('event', ['preventDefault']);
        const dropdown1 = fixture.componentInstance.dropdown1;
        const dropdown2 = fixture.componentInstance.dropdown2;
        dropdown1.setSelectedItem(1);
        expect(dropdown1.selectedItem).toEqual(dropdown1.items[1]);
        expect(dropdown2.selectedItem).toEqual(null);
        dropdown2.setSelectedItem(3);
        expect(dropdown1.selectedItem).toEqual(dropdown1.items[1]);
        expect(dropdown2.selectedItem).toEqual(dropdown2.items[3]);
        dropdown1.setSelectedItem(5);
        expect(dropdown1.selectedItem).toEqual(dropdown1.items[5]);
        expect(dropdown2.selectedItem).toEqual(dropdown2.items[3]);
    }));

    it('Should properly handle OnEnterKeyDown when the dropdown is not visible', fakeAsync(() => {
        const fixture = TestBed.createComponent(InputWithDropdownDirectiveComponent);
        fixture.detectChanges();
        const dropdown = fixture.componentInstance.dropdown;
        const inputElement = fixture.componentInstance.inputElement.nativeElement;
        expect(dropdown).toBeDefined();
        expect(inputElement).toBeDefined();
        expect(dropdown.focusedItem).toEqual(null);
        expect(dropdown.selectedItem).toEqual(null);
        spyOn(dropdown, 'selectItem').and.callThrough();
        expect(dropdown.selectItem).toHaveBeenCalledTimes(0);
        expect(dropdown.collapsed).toEqual(true);
        inputElement.click();
        tick();
        expect(dropdown.selectItem).toHaveBeenCalledTimes(0);
        expect(dropdown.collapsed).toEqual(true);
        expect(dropdown.focusedItem).toEqual(null);
        inputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        tick();
        expect(dropdown.selectItem).toHaveBeenCalledTimes(1);
        expect(dropdown.selectItem).toHaveBeenCalledWith(null);
        expect(dropdown.selectedItem).toEqual(null);
        expect(dropdown.collapsed).toEqual(true);
        dropdown.toggle();
        tick();
        expect(dropdown.collapsed).toEqual(false);
        expect(dropdown.focusedItem).toEqual(dropdown.items[0]);
        const dropdownItem = dropdown.items[0];
        inputElement.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        tick();
        expect(dropdown.selectItem).toHaveBeenCalledTimes(2);
        expect(dropdown.selectItem).toHaveBeenCalledWith(dropdownItem);
        expect(dropdown.selectedItem).toEqual(dropdownItem);
        expect(dropdown.collapsed).toEqual(true);
    }));
});

@Component({
    template: `
    <button (click)="toggleDropDown()">Toggle</button>
    <igx-drop-down igxDropDownItemNavigation (onSelection)="onSelection($event)"
    (onOpening)="onToggleOpening()" (onOpened)="onToggleOpened()"
    (onClosing)="onToggleClosing()" (onClosed)="onToggleClosed()" [width]="'400px'" [height]="'400px'">
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>`
})
class IgxDropDownTestComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdown: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Nav1' },
        { field: 'Nav2' },
        { field: 'Nav3' },
        { field: 'Nav4' }
    ];

    public toggleDropDown() {
        this.dropdown.toggle();
    }

    public onSelection(ev) { }

    public onToggleOpening() { }

    public onToggleOpened() { }

    public onToggleClosing() { }

    public onToggleClosed() { }
}

@Component({
    template: `
    <button (click)="toggleDropDown()">Show</button>
    <button (click)="selectItem5()">Select 5</button>
    <igx-drop-down igxDropDownItemNavigation #scrollDropDown>
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class IgxDropDownTestScrollComponent {

    @ViewChild('scrollDropDown', { read: IgxDropDownComponent })
    public dropdownScroll: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Item 1' },
        { field: 'Item 2' },
        { field: 'Item 3' },
        { field: 'Item 4' },
        { field: 'Item 5' },
        { field: 'Item 6' },
        { field: 'Item 7' },
        { field: 'Item 8' },
        { field: 'Item 9' },
        { field: 'Item 10' },
        { field: 'Item 11' },
        { field: 'Item 12' },
        { field: 'Item 13' },
        { field: 'Item 14' },
        { field: 'Item 15' }
    ];

    public toggleDropDown() {
        this.dropdownScroll.toggle();
    }

    public selectItem5() {
        this.dropdownScroll.setSelectedItem(4);
    }
}

@Component({
    template: `
    <button (click)="toggleDropDown()">Show</button>
    <button (click)="selectItem5()">Select 5</button>
    <igx-drop-down igxDropDownItemNavigation #dropdownDisabledAny>
        <igx-drop-down-item *ngFor="let item of items" disabled={{item.disabled}} isHeader={{item.header}}>
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class IgxDropDownTestDisabledAnyComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdownDisabledAny: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Item 111' },
        { field: 'Item 2', header: true },
        { field: 'Item 3' },
        { field: 'Item 4', disabled: true },
        { field: 'Item 5', header: true },
        { field: 'Item 6' },
        { field: 'Item 7' },
        { field: 'Item 8', disabled: true },
        { field: 'Item 9' },
        { field: 'Item 10' },
        { field: 'Item 11' },
        { field: 'Item 12', disabled: true },
        { field: 'Item 13' },
        { field: 'Item 14' },
        { field: 'Item 15' }
    ];

    public toggleDropDown() {
        this.dropdownDisabledAny.toggle();
    }

    public selectItem5() {
        this.dropdownDisabledAny.setSelectedItem(4);
    }
}

@Component({
    template: `
    <button (click)="toggleDropDown()">Show</button>
    <button (click)="selectItem5()">Select 5</button>
    <igx-drop-down igxDropDownItemNavigation #dropdownDisabled>
        <igx-drop-down-item *ngFor="let item of items" disabled={{item.disabled}} isHeader={{item.header}}>
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class IgxDropDownTestDisabledComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdownDisabled: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Item 111', disabled: true },
        { field: 'Item 2', header: true },
        { field: 'Item 3' },
        { field: 'Item 4', disabled: true },
        { field: 'Item 5', header: true },
        { field: 'Item 6' },
        { field: 'Item 7' },
        { field: 'Item 8', disabled: true },
        { field: 'Item 9' },
        { field: 'Item 10' },
        { field: 'Item 11' },
        { field: 'Item 12', disabled: true },
        { field: 'Item 13' },
        { field: 'Item 14' },
        { field: 'Item 15', disabled: true }
    ];

    public toggleDropDown() {
        this.dropdownDisabled.toggle();
    }

    public selectItem5() {
        this.dropdownDisabled.setSelectedItem(4);
    }
}

@Component({
    template: `
    <button (click)="toggleDropDown()">Show</button>
    <igx-drop-down igxDropDownItemNavigation #dropdownDisabled>
        <igx-drop-down-item *ngFor="let item of items" disabled={{item.disabled}} isHeader={{item.header}}>
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class IgxDropDownTestEmptyListComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdownEmpty: IgxDropDownComponent;

    public items: any[] = [];

    public toggleDropDown() {
        this.dropdownEmpty.toggle();
    }
}
@Component({
    template: `
    <button (click)="selectItem5()">Select 5</button>
    <igx-drop-down igxDropDownItemNavigation #scrollDropDown>
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class IgxDropDownWithScrollComponent implements OnInit {

    @ViewChild('scrollDropDown', { read: IgxDropDownComponent })
    public dropdownScroll: IgxDropDownComponent;

    public items: any[] = [];

    public toggleDropDown() {
        this.dropdownScroll.toggle();
    }

    public selectItem5() {
        this.dropdownScroll.setSelectedItem(4);
    }

    ngOnInit() {
        this.dropdownScroll.height = '200px';
        for (let index = 1; index < 100; index++) {
            this.items.push({ field: 'Item ' + index });
        }
    }
}

@Component({
    template: `
    <button (click)="selectItem5()">Select 5</button>
    <igx-drop-down #dropdown1>
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    <igx-drop-down #dropdown2>
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>
    `
})
class DoubleIgxDropDownComponent implements OnInit {

    @ViewChild('dropdown1', { read: IgxDropDownComponent })
    public dropdown1: IgxDropDownComponent;

    @ViewChild('dropdown2', { read: IgxDropDownComponent })
    public dropdown2: IgxDropDownComponent;

    public items: any[] = [];

    ngOnInit() {
        for (let index = 1; index < 100; index++) {
            this.items.push({ field: 'Item ' + index });
        }
    }
}

@Component({
    template: `
    <input (click)="toggleDropDown()">
    <igx-drop-down igxDropDownItemNavigation (onSelection)="onSelection($event)"
    (onOpening)="onToggleOpening()" (onOpened)="onToggleOpened()"
    (onClosing)="onToggleClosing()" (onClosed)="onToggleClosed()" [width]="'400px'" [height]="'400px'">
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>`
})
class IgxDropDownInputTestComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdown: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Nav1' },
        { field: 'Nav2' },
        { field: 'Nav3' },
        { field: 'Nav4' }
    ];

    public toggleDropDown() {
        this.dropdown.toggle();
    }

    public onSelection(ev) { }

    public onToggleOpening() { }

    public onToggleOpened() { }

    public onToggleClosing() { }

    public onToggleClosed() { }
}

@Component({
    template: `
    <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png" (click)="toggleDropDown()">
    <igx-drop-down igxDropDownItemNavigation (onSelection)="onSelection($event)"
    (onOpening)="onToggleOpening()" (onOpened)="onToggleOpened()"
    (onClosing)="onToggleClosing()" (onClosed)="onToggleClosed()" [width]="'400px'" [height]="'400px'">
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>`
})
class IgxDropDownImageTestComponent {

    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdown: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Nav1' },
        { field: 'Nav2' },
        { field: 'Nav3' },
        { field: 'Nav4' }
    ];

    public toggleDropDown() {
        this.dropdown.toggle();
    }

    public onSelection(ev) { }

    public onToggleOpening() { }

    public onToggleOpened() { }

    public onToggleClosing() { }

    public onToggleClosed() { }
}

@Component({
    template: `
    <igx-tabs (onTabItemSelected)="toggleDropDown()" tabsType="fixed">
        <igx-tabs-group label="Tab111111111111111111111111">
            <ng-template igxTab>
                <div>T1</div>
                </ng-template>
                <h1>Tab 1 Content</h1>
            </igx-tabs-group>
        <igx-tabs-group label="Tab 2">
            <ng-template igxTab>
                <div>T2</div>
            </ng-template>
            <h1>Tab 2 Content</h1>
        </igx-tabs-group>
        <igx-tabs-group label="Tab 3">
            <ng-template igxTab>
                <div>T3</div>
            </ng-template>
            <h1>Tab 3 Content</h1>
        </igx-tabs-group>
    </igx-tabs>
    <igx-drop-down igxDropDownItemNavigation (onSelection)="onSelection($event)"
    (onOpening)="onToggleOpening()" (onOpened)="onToggleOpened()"
    (onClosing)="onToggleClosing()" (onClosed)="onToggleClosed()" [width]="'400px'" [height]="'400px'">
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>`
})
class IgxDropDownTabsTestComponent {

    @ViewChild(IgxTabsComponent)
    public tabs: IgxTabsComponent;
    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdown: IgxDropDownComponent;

    public items: any[] = [
        { field: 'Nav1' },
        { field: 'Nav2' },
        { field: 'Nav3' },
        { field: 'Nav4' }
    ];

    public toggleDropDown() {
        this.dropdown.toggle();
    }

    public onSelection(ev) { }

    public onToggleOpening() { }

    public onToggleOpened() { }

    public onToggleClosing() { }

    public onToggleClosed() { }
}

@Component({
    template: ` <input #inputElement [igxDropDownItemNavigation]="dropdownElement" class='test-input' type='text' value='Focus Me!'/>
    <igx-drop-down #dropdownElement [width]="'400px'" [height]="'400px'">
        <igx-drop-down-item *ngFor="let item of items">
            {{ item.field }}
        </igx-drop-down-item>
    </igx-drop-down>`
})
class InputWithDropdownDirectiveComponent {
    @ViewChild(IgxDropDownComponent, { read: IgxDropDownComponent })
    public dropdown: IgxDropDownComponent;

    @ViewChild(`inputElement`)
    public inputElement: ElementRef;

    public items: any[] = [
        { field: 'Nav1' },
        { field: 'Nav2' },
        { field: 'Nav3' },
        { field: 'Nav4' }
    ];
}
