import { Injectable } from '@angular/core'
import { AuthService } from 'src/app/auth.service'
import { EventService } from '../event/event.service'
import { select, Store } from '@ngrx/store'
import * as Reducers from 'src/app/store/reducers'

@Injectable({
  providedIn: 'root',
})
export class SyncfbService {
  cansaveorder = true
  pendingorders: any = []
  preorders: any = []
  cansavepreorder: boolean = true
  cansavependingorder: boolean = true
  onlineMode: boolean = true

  constructor(private auth: AuthService, private event: EventService, private store: Store<any>) {
    this.store.pipe(select(Reducers.getSettings)).subscribe(state => {
      this.onlineMode = state.isOnlineMode
      console.log(this.onlineMode, state.isOnlineMode)
      if (this.onlineMode) this.sync()
    })
  }
  sync() {
    console.log(this.cansavepreorder, this.cansavependingorder)
    if (this.preorders.length == 0) this.cansavepreorder = true
    if (this.pendingorders.length == 0) this.cansavependingorder = true
    // if (this.cansavepreorder) this.getpreorders()
    if (this.cansavependingorder) this.getorders()
    console.log(this.cansavepreorder, this.cansavependingorder)
    // this.getorders()
  }

  getorders() {
    console.log("get getorders...")
    this.event.emitNotif({ newerrororder: true })
    if (navigator.onLine) {
      console.log("navigator.onLine => true")
      if (this.pendingorders.length == 0) {
        console.log("this.preorders.length == 0")
        console.log(this.pendingorders)
        this.cansavependingorder = false
        this.auth.getordersfb().subscribe(data => {
          this.pendingorders = data
          console.log("this.pendingorders.length ==> ", this.pendingorders.length)
          if (this.pendingorders.length > 0) this.saveorders()
          else this.cansavependingorder = true
        })
      } else {
        console.log()
        this.saveorders()
      }
    } else {
      setTimeout(() => {
        this.getorders()
      }, 30000)
    }
  }
  saveorders() {
    // if (!this.onlineMode) {
    //   this.cansavependingorder = true
    //   return
    // }
    var order = this.pendingorders.shift()
    console.log(order)
    this.auth.saveorderfb({ "OrderJson": JSON.stringify(order) }).subscribe(
      data => {
        console.log(data)
        var responselogdata = {
          invoiceno: order.invoiceno,
          loggeddatetime: new Date().getTime(),
          response: data,
        }
        // this.auth.getstoredata(order.CompanyId, order.StoreId, 1).subscribe(data1 => {
        //   console.log(data1)
        //   this.auth.getstoredatadb(data1).subscribe(d => {
        //     console.log(d)

        //   })
        // })
        this.logresponse(responselogdata)
        if (data['status'] == 200 || data['status'] == 409) {
          this.auth.transactionsinvoice(order.InvoiceNo).subscribe(trdt => {
            var transactions: any = trdt
            if (transactions.length > 0) {
              transactions.forEach(tr => {
                tr.OrderId = data['data'][0].OrderId
              })
              this.auth.ordertransaction(transactions).subscribe(otdt => {
                this.auth.deleteorderfromdbfb(order._id, order.InvoiceNo).subscribe(ddata => {
                  this.getorders()
                })
              })
            } else {
              this.auth.deleteorderfromdbfb(order._id, order.InvoiceNo).subscribe(ddata => {
                this.getorders()
              })
            }
          })
        } else if (data['status'] == 409) {
          order.status = 'D'
          this.auth.updateordertonedb(order).subscribe(ddata => {
            console.log(ddata)
            this.getorders()
          })
        } else if (data['status'] == 500) {
          order.status = 'E'
          order.error = data['error']
          this.auth.updateordertonedb(order).subscribe(ddata => {
            console.log(ddata)
            this.getorders()
          })
        }
      },
      error => {
        this.getorders()
      },
    )
  }
  /////////////////////////////////////////// PREORDERS
  getpreorders() {
    // this.event.emitNotif({ newerrororder: true })
    // console.log("get preorders...")
    if (navigator.onLine) {
      // console.log("navigator.onLine => true")
      if (this.preorders.length == 0) {
        // console.log("this.preorders.length == 0")
        this.cansavepreorder = false
        this.auth.getpreorders().subscribe(data => {
          this.preorders = data
          this.preorders = this.preorders.filter(
            x => x.datastatus == 'new_order' || x.datastatus == 'edit_order',
          )
          // console.log("this.preorders.length ==> ", this.preorders.length)
          if (this.preorders.length > 0) this.savepreorder()
          else this.cansavepreorder = true
        })
      } else {
        this.savepreorder()
      }
    } else {
      setTimeout(() => {
        this.getpreorders()
      }, 30000)
    }
  }
  savepreorder() {
    // if (!this.onlineMode) {
    //   this.cansavepreorder = true
    //   return
    // }
    console.log("savepreorder...")
    console.log("this.onlineMode ", this.onlineMode);

    var order = this.preorders.shift()
    if (
      order.datastatus == 'new_order' ||
      (order.datastatus == 'new_order_retry' && order.retrytime >= new Date().getTime())
    ) {
      this.auth.saveorderfb({ OrderJson: JSON.stringify(order) }).subscribe(
        data => {
          var responselogdata = {
            invoiceno: order.InvoiceNo,
            loggeddatetime: new Date().getTime(),
            response: data,
          }
          this.logresponse(responselogdata)
          if (data['status'] == 200) {
            order.status = 'S'
            order.OrderId = data['data'][0].OrderId
            order.changeditems = []
            order.Transactions = []
            this.auth.transactionsinvoice(order.InvoiceNo).subscribe(trdt => {
              var transactions: any = trdt
              if (transactions.length > 0) {
                transactions.forEach(tr => {
                  tr.OrderId = data['data'][0].OrderId
                })
                this.auth.ordertransaction(transactions).subscribe(otdt => {
                  this.auth.updatepreorders(order).subscribe(ddata => {
                    this.getpreorders()
                  })
                })
              } else {
                this.auth.updatepreorders(order).subscribe(ddata => {
                  this.getpreorders()
                })
              }
            })
          } else if (data['status'] == 409) {
            order.status = 'D'
            this.auth.updatepreorders(order).subscribe(ddata => {
              this.getpreorders()
            })
          } else if (data['status'] == 500) {
            order.status = 'E'
            order.error = data['error']
            if (
              data['error']['InnerException'] != null &&
              data['error']['InnerException'].includes('Timeout expired')
            ) {
              order.status = 'P'
              order.datastatus = 'new_order_retry'
              order.retrytime = new Date().getTime() + 60000
            }
            this.auth.updatepreorders(order).subscribe(ddata => {
              this.getpreorders()
            })
          }
        },
        error => {
          this.getpreorders()
        },
      )
    } else if (
      order.datastatus == 'edit_order' ||
      (order.datastatus == 'edit_order_retry' && order.retrytime >= new Date().getTime())
    ) {
      this.auth.updateorder({ OrderJson: JSON.stringify(order) }).subscribe(
        data => {
          if (data['status'] == 200) {
            order.status = 'S'
            order.changeditems = []
            order.Transactions = []

            this.auth.transactionsinvoice(order.InvoiceNo).subscribe(trdt => {
              var transactions: any = trdt
              if (transactions.length > 0) {
                transactions.forEach(tr => {
                  tr.OrderId = order.OrderId
                })
                this.auth.ordertransaction(transactions).subscribe(otdt => {
                  this.auth.logtransactions(transactions).subscribe(tldt => { })
                  this.auth.updatepreorders(order).subscribe(ddata => {
                    this.getpreorders()
                  })
                })
              } else {
                this.auth.updatepreorders(order).subscribe(ddata => {
                  this.getpreorders()
                })
              }
            })
          } else if (data['status'] == 409) {
            order.status = 'D'
            this.auth.updatepreorders(order).subscribe(ddata => {
              this.getpreorders()
            })
          } else if (data['status'] == 500) {
            order.status = 'E'
            order.error = data['error']
            console.log(data)
            if (data['error']['Message'] != null && data['error']['Message'].includes('Timeout')) {
              order.status = 'P'
              order.datastatus = 'edit_order_retry'
              order.retrytime = new Date().getTime() + 60000
            }
            this.auth.updatepreorders(order).subscribe(ddata => {
              this.getpreorders()
            })
          }
        },
        error => {
          this.getpreorders()
        },
      )
    } else {
      this.getpreorders()
    }
  }
  logresponse(logdata) {
    this.auth.logordersaveresponse(logdata).subscribe(data => { })
  }
}
