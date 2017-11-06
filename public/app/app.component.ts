import { Component, ViewContainerRef } from '@angular/core';
import { AppBridge, TextBoxControl, SelectControl, NovoFormGroup, FormUtils, FieldInteractionApi, NovoToastService } from 'novo-elements';

import { AppBridgeService } from 'app/service/app-bridge.service';

@Component({
  selector: 'platform-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  public openForm: NovoFormGroup;
  public appControl: SelectControl;
  public entityTypeControl: SelectControl;
  public entityIdControl: TextBoxControl;
  public tabControl: TextBoxControl;
  public criteriaControl: TextBoxControl;
  public keywordsControl: TextBoxControl;
  public requestDataForm: NovoFormGroup;
  public dataTypeControl: SelectControl;

  constructor(private appBridge: AppBridgeService, private formUtils: FormUtils, viewContainerRef: ViewContainerRef, private toaster: NovoToastService) {
    this.toaster.parentViewContainer = viewContainerRef;

    let appFI: Function = (FAPI: FieldInteractionApi) => {
      let value: string = FAPI.getActiveValue();
      if (value === 'Record') {
        FAPI.hide('keywords');
        FAPI.hide('criteria');
        FAPI.show('id');
        FAPI.show('tab');
      } else if (value === 'Fast Add') {
        FAPI.hide('id');
        FAPI.hide('tab');
        FAPI.hide('keywords');
        FAPI.hide('criteria');
      } else if (value === 'List') {
        FAPI.hide('id');
        FAPI.hide('tab');
        FAPI.show('keywords');
        FAPI.show('criteria');
      }
    };

    this.appControl = new SelectControl({ key: 'app', value: 'Record', options: ['Record', 'Fast Add', 'List'], label: 'Select App', interactions: [{ invokeOnInit: true, event: 'change', script: appFI }] });
    this.entityTypeControl = new SelectControl({ key: 'entity', label: 'Entity', value: 'ClientCorporation', options: ['ClientCorporation', 'ClientContact', 'Candidate', 'Lead', 'Opportunity', 'JobOrder', 'Placement'] });
    this.entityIdControl = new TextBoxControl({ key: 'id', label: 'ID' });
    this.tabControl = new TextBoxControl({ key: 'tab', label: 'Tab', value: 'overview' });
    this.criteriaControl = new TextBoxControl({ key: 'criteria', label: 'Criteria' });
    this.keywordsControl = new TextBoxControl({ key: 'keywords', label: 'Keywords' });

    this.openForm = this.formUtils.toFormGroup([
      this.appControl,
      this.entityTypeControl,
      this.entityIdControl,
      this.tabControl,
      this.criteriaControl,
      this.keywordsControl,
    ]);

    this.dataTypeControl = new SelectControl({ key: 'type', value: 'user', options: ['user', 'settings', 'entitlements', 'all'], label: 'Data Type' });
    this.requestDataForm = this.formUtils.toFormGroup([this.dataTypeControl]);
  }

  public update(): void {
    this.appBridge.execute((bridge: AppBridge) => {
      bridge.update({ title: 'UPDATED TITLE!', color: 'green' }).then((success: any) => {
        console.log('[AppComponent] - Update Success!', success); // tslint:disable-line
      });
    });
  }

  public refresh(): void {
    this.appBridge.execute((bridge: AppBridge) => {
      bridge.refresh().then((success: any) => {
        console.log('[AppComponent] - Refresh Success!', success); // tslint:disable-line
      });
    });
  }

  public close(): void {
    this.appBridge.execute((bridge: AppBridge) => {
      bridge.close().then((success: any) => {
        console.log('[AppComponent] - Close Success!', success); // tslint:disable-line
      });
    });
  }

  public pin(): void {
    this.appBridge.execute((bridge: AppBridge) => {
      bridge.pin().then((success: any) => {
        console.log('[AppComponent] - Pin Success!', success); // tslint:disable-line
      });
    });
  }

  public open(): void {
    if (this.openForm.value['app'] === 'Record') {
      if (this.openForm.value['entity'] && this.openForm.value['id']) {
        this.appBridge.execute((bridge: AppBridge) => {
          bridge.open({
            type: 'record',
            entityType: this.openForm.value['entity'],
            entityId: this.openForm.value['id'],
            tab: this.openForm.value['tab'],
          }).then((success: any) => {
            console.log('[AppComponent] - Open Success!', success); // tslint:disable-line
          });
        });
      } else {
        this.toaster.alert({
          title: 'Invalid Configuration!',
          message: 'Fill out the form!',
          theme: 'danger',
          hideDelay: 3000,
        });
      }
    } else if (this.openForm.value['app'] === 'Fast Add') {
      if (this.openForm.value['entity']) {
        this.appBridge.execute((bridge: AppBridge) => {
          bridge.open({
            type: 'add',
            entityType: this.openForm.value['entity'],
          }).then((success: any) => {
            console.log('[AppComponent] - Open Success!', success); // tslint:disable-line
          });
        });
      } else {
        this.toaster.alert({
          title: 'Invalid Configuration!',
          message: 'Fill out the form!',
          theme: 'danger',
          hideDelay: 3000,
        });
      }
    } else if (this.openForm.value['app'] === 'List') {
      if (this.openForm.value['entity']) {
        this.appBridge.execute((bridge: AppBridge) => {
          bridge.openList({
            type: this.openForm.value['entity'],
            keywords: this.openForm.value['keywords'],
            criteria: this.openForm.value['criteria'],
          }).then((success: any) => {
            console.log('[AppComponent] - Open Success!', success); // tslint:disable-line
          });
        });
      } else {
        this.toaster.alert({
          title: 'Invalid Configuration!',
          message: 'Fill out the form!',
          theme: 'danger',
          hideDelay: 3000,
        });
      }
    }
  }

  public requestData(): void {
    this.appBridge.execute((bridge: AppBridge) => {
      bridge.requestData({
        type: this.requestDataForm.value['type'],
      }).then((success: any) => {
        console.log('[AppComponent] - Request Data Success!', success); // tslint:disable-line
      });
    });
  }
}
