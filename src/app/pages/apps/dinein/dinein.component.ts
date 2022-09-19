import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { toast,dangertoast } from 'src/assets/dist/js/toast-data';
import { Directive, HostListener, ElementRef } from '@angular/core';





@Component({
  selector: 'app-dinein',
  templateUrl: './dinein.component.html',
  styleUrls: ['./dinein.component.scss']
})
export class DineinComponent implements OnInit {

  constructor(private Auth: AuthService, private modalService: NgbModal, private el: ElementRef) { }

  loginfo: any
  CompanyId: any = []
  StoreId: any
  dining: any
  status: number;
  errorMsg: string = '';
  term;
  show = true;
  edttable: any;
  DineinId: any;
  DiningArea = { StoreId: 0, Id: 0, Description: "Floor 1", DiningTable: [{ Id: 0, Description: "Table 1", DiningAreaId: 0, CompanyId: this.CompanyId, StoreId: 0 }], CompanyId: this.CompanyId, Del: [{ Id: 0 }] };
  store: any


  ngOnInit(): void {
    this.Auth.getdbdata(['loginfo']).subscribe(data => {
      this.loginfo = data['loginfo'][0]
      this.CompanyId = this.loginfo.companyId
      this.StoreId = this.loginfo.storeId
      console.log(this.loginfo)
      // this.edittable()
      this.getStore()
      this.getTable()
    })
  }

  edittable(Id) {
    this.DineinId = Id
    if (this.DineinId > 0) {
      this.Auth.EditTable(this.DineinId).subscribe(data => {
        // console.log(data)
        this.edttable = this.DiningArea
        this.edttable = data[0];
        console.log(this.edttable)
        this.DiningArea.Description = this.edttable.DiningArea;
        console.log(this.DiningArea)
        this.DiningArea.Id = this.edttable.Id;
        this.DiningArea.StoreId = this.edttable.StoreId;
        this.DiningArea.DiningTable = [];
        this.DiningArea.Del = [];
        this.edttable.DiningTable.forEach(element => {
          var obj = { Id: element.id, Description: element.description, DiningAreaId: this.DiningArea.Id, StoreId: this.DiningArea.StoreId, CompanyId: this.loginfo.companyId };
          this.DiningArea.DiningTable.push(obj);
        });
      })
      this.show = !this.show

    }
  }

  getTable() {
    this.Auth.getdining(this.loginfo.companyId).subscribe(data => {
      this.dining = data;
      console.log(this.dining);
      this.show = true
    })
  }

  editdineing(dining) {
    this.dining = dining
    console.log(dining)
    this.show = !this.show
  }

  back() {
    this.show = !this.show;
    this.DiningArea = { StoreId: 0, Id: 0, Description: "Floor 1", DiningTable: [{ Id: 0, Description: "Table 1", DiningAreaId: 0, CompanyId: this.CompanyId, StoreId: 0 }], CompanyId: this.CompanyId, Del: [{ Id: 0 }] };

  }



  DeleteTable(Id) {
    this.Auth.deleteArea(Id).subscribe(data => {
      var response: any = data;

    });
  }
  openDetailpopup(contentDetail) {
    const modalRef = this.modalService
      .open(contentDetail, {
        ariaLabelledBy: "modal-basic-title",
        centered: true
      })
      .result.then(
        result => {
        },
        reason => {
        }
      );
  }

  compare(a, b) {
    if (a.Description.replace(/\s/g, "").toLowerCase() < b.Description.replace(/\s/g, "").toLowerCase()) {
      return -1;
    }
    if (a.Description.replace(/\s/g, "").toLowerCase() > b.Description.replace(/\s/g, "").toLowerCase()) {
      return 1;
    }
    return 0;
  }

  savearea() {
    var sortedvalue = this.DiningArea.DiningTable.sort(this.compare);
    console.log(sortedvalue)
    for (let i = 0; i < sortedvalue.length - 1; i++) {
      if (sortedvalue[i + 1].Description.replace(/\s/g, "").toLowerCase() == sortedvalue[i].Description.replace(/\s/g, "").toLowerCase()) {
        return;
      }
    }

    var data = { data: JSON.stringify(this.DiningArea) }
    this.Auth.addtable(data).subscribe(data => {
      var response: any = data;

    });

    var data = { data: JSON.stringify(this.DiningArea) }
    this.Auth.UpdateTable(data).subscribe(data => {
      var response: any = data

    });
  }

  addTable() {
    this.DiningArea.DiningTable.push({ Id: 0, Description: "", DiningAreaId: this.DiningArea.Id, CompanyId: this.CompanyId, StoreId: this.DiningArea.StoreId });
  }
  focus() {

    const invalidElements = this.el.nativeElement.querySelectorAll('.ng-invalid');
    if (invalidElements.length > 0) {
      invalidElements[1].focus();
    }
    this.getTable()
  }

  deleteTable(index) {
    var id = this.DiningArea.DiningTable[index].Id;
    this.DiningArea.Del.push({ Id: id })
    this.DiningArea.DiningTable.splice(index, 1);
  }
  getStore() {
    this.Auth.getstore(this.CompanyId).subscribe(data => {
      this.store = data;
      console.log(this.store);
    });
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (k >= 48 && k <= 57));
  }
  quickadd(prefix, count) {
    this.DiningArea.DiningTable = this.DiningArea.DiningTable.filter(x => x.Id != 0);
    if (+count) {
      for (let i = 0; i < +count; i++) {
        var obj = { Id: 0, Description: prefix + " " + (i + 1), DiningAreaId: this.DiningArea.Id, CompanyId: this.CompanyId, StoreId: this.DiningArea.StoreId };
        if (this.DiningArea.DiningTable[i] == undefined) {
          this.DiningArea.DiningTable.push(obj);
        } else {
          this.DiningArea.DiningTable[i].Description = prefix + " " + (i + 1);
        }
      }
    } else {
      var code: number = count.charCodeAt(0);
      let I;
      let j = 0;
      if (code > 64 && code < 91) {
        I = 65;
      } else if (code > 96 && code < 123) {
        I = 97;
      }
      for (let i = I; i <= code; i++) {
        var obj = { Id: 0, Description: prefix + " " + String.fromCharCode(i), DiningAreaId: this.DiningArea.Id, CompanyId: this.CompanyId, StoreId: this.DiningArea.StoreId };
        if (this.DiningArea.DiningTable[j] == undefined) {
          this.DiningArea.DiningTable.push(obj);
        } else {
          this.DiningArea.DiningTable[j].Description = prefix + " " + String.fromCharCode(i);
        }
        j++
      }
    }
  }

}
