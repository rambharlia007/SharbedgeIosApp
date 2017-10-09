import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http'
import { rowViewModel } from '../../shared/row';
import { PageViewModel } from '../../shared/page';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import { AlertController } from 'ionic-angular';
import { NgZone } from '@angular/core';
import { AccaPage } from '../acca/acca';
import { OddsCutPage } from '../odds-cut/odds-cut';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Login } from '../login/login';
import { SubscribePage } from '../subscribe/subscribe';
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  fixtures: rowViewModel[] = [];
  fixtureCopy: rowViewModel[] = [];
  pageIndex: any;
  counter: any;
  isPreviousDisabled: any = true;
  isNextDisabled: any = false;
  paginationButtons: any[] = [];
  totalRecords: any;
  pagination: PageViewModel[] = [];
  pageLimit: number = 100;
  totalPage: any;
  headerFooterVisible: boolean = false;
  scrollTopPosition: any = 0;
  isSearch = false;
  totalSummaryText: string;
  paddingTop = "p1";
  sortValue = "ALH";
  sharbTypeId;
  updatedAt: string;
  pageTitle: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http,
    public alertCtrl: AlertController, private _zone: NgZone, public loadingCtrl: LoadingController, private storage: Storage, private iab: InAppBrowser) {
    // If we navigated to this page, we will have an item available as a nav param
    this.sharbTypeId = navParams.get("id");
    this.pageTitle = navParams.get("title");
  }

  setLastUpdatedTime() {
    var currentTime = new Date().toLocaleTimeString('en-GB',
      {
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      });
    this.updatedAt = "Last updated: " + currentTime
  }


  subscription
  ngOnInit() {
    this.counter = 1;
    this.getFixtures();
    let timer = Observable.timer(30000, 30000);
    this.subscription = timer.subscribe(t => {
      if (this.navCtrl.getActive().name == "ListPage") {
        this.updateFixtures();
        this.setLastUpdatedTime();
      }
      else {
        this.subscription.unsubscribe();
      }
    });
  };

  //http://ads.betfair.com/redirect.aspx?pid=42135&bid=9890&redirecturl=https://www.betfair.com/exchange/football/event/28156181/market?marketId=1.130390853
  betFairLink(data: rowViewModel) {
    var urlValue = "http://ads.betfair.com/redirect.aspx?pid=42135&bid=9890&redirecturl=https://www.betfair.com/exchange/football/event/" + data.eventId + "/market?marketId=" + data.marketId;
    const browser = this.iab.create(urlValue, "_blank", "location=yes");
    // browser.show();
    // browser.close();
  }

  sortFixtures(param: any, isSortEvent: boolean = true) {
    if (isSortEvent)
      this.presentLoading();
    var proName = param;
    var obj = JSON.parse(param);
    var prop = obj.value;
    this.alertCheckedId = parseInt(obj.id);

    if (this.alertCheckedId <= 6) {
      if (obj.sortId === "1") {
        this.fixtureCopy = this.fixtureCopy.sort(function (a, b) {
          var n1 = parseFloat(a[prop].replace(/[^-.0-9]/g, ''));
          var n2 = parseFloat(b[prop].replace(/[^-.0-9]/g, ''));
          return n1 - n2;
        });
      }
      else {
        this.fixtureCopy = this.fixtureCopy.sort(function (a, b) {
          return parseFloat(b[prop].replace(/[^-.0-9]/g, '')) - parseFloat(a[prop].replace(/[^-.0-9]/g, ''));
        });
      }
    }
    else {
      if (obj.sortId === "1") {
        this.fixtureCopy = this.fixtureCopy.sort(function (a, b) {
          var nameA = a.eventName.toUpperCase().split(' ').join(''); // ignore upper and lowercase
          var nameB = b.eventName.toUpperCase().split(' ').join(''); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
      }
      else {
        this.fixtureCopy = this.fixtureCopy.sort(function (a, b) {
          var nameA = a.eventName.toUpperCase().split(' ').join(''); // ignore upper and lowercase
          var nameB = b.eventName.toUpperCase().split(' ').join(''); // ignore upper and lowercase
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          return 0;
        });
      }
    }
    if (isSortEvent) {
      this.fixtures = this.fixtureCopy.slice(0, this.pageLimit);
      this.loader.dismiss();
    }
  }

  currentSortValue;
  alertCheckedId: number = 0;
  alert: any;
  showRadio() {
    this.alert = this.alertCtrl.create();
    this.alert.setTitle('Sort by');

    this.alert.addInput({
      type: 'radio',
      label: 'Arb Low to High',
      value: '{"value" : "Arb", "sortId" : "1", "id" : "1" }',
      checked: this.alertCheckedId == 1 ? true : false,
      id: '1'
    });

    this.alert.addInput({
      type: 'radio',
      label: 'Arb High to Low',
      value: '{"value" : "Arb", "sortId" : "2","id" : "2"}',
      checked: this.alertCheckedId == 2 ? true : false,
      id: '2'
    });

    this.alert.addInput({
      type: 'radio',
      label: 'LC Low to High',
      value: '{"value" : "LC", "sortId" : "1","id" : "3"}',
      checked: this.alertCheckedId == 3 ? true : false,
      id: '3'
    });

    this.alert.addInput({
      type: 'radio',
      label: 'LC High to Low',
      value: '{"value" : "LC", "sortId" : "2","id" : "4"}',
      checked: this.alertCheckedId == 4 ? true : false,
      id: '4'
    });

    this.alert.addInput({
      type: 'radio',
      label: '5% Low to High',
      value: '{"value" : "fivePercent", "sortId" : "1","id" : "5"}',
      checked: this.alertCheckedId == 5 ? true : false,
      id: '5'
    });

    this.alert.addInput({
      type: 'radio',
      label: '5% High to Low',
      value: '{"value" : "fivePercent", "sortId" : "2","id" : "6"}',
      checked: this.alertCheckedId == 6 ? true : false,
      id: '6'
    });


    this.alert.addInput({
      type: 'radio',
      label: 'Event Asc to Desc',
      value: '{"value" : "eventName", "sortId" : "1","id" : "13"}',
      checked: this.alertCheckedId == 13 ? true : false,
      id: '13'
    });

    this.alert.addInput({
      type: 'radio',
      label: 'Event Desc to Asc',
      value: '{"value" : "eventName", "sortId" : "2","id" : "14"}',
      checked: this.alertCheckedId == 14 ? true : false,
      id: '14'
    });

    this.alert.addButton('Cancel');
    this.alert.addButton({
      text: 'OK',
      handler: data => {
        this.currentSortValue = data;
        this.sortFixtures(data)
        this.processPagination(this.fixtureCopy, false)
      }
    });
    this.alert.present();
  }

  searchTextValue;
  searchFixtures(value: any, isUpdateEvent: boolean = false) {
    // Reset items back to all of the items
    var tempfixtureCopy = this.fixtureCopy;
    var tempFixtures: rowViewModel[] = [];
    // set val to the value of the searchbar
    let val = value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.isSearch = true;
      this.searchTextValue = val;
      tempFixtures = tempfixtureCopy.filter((item) => {
        return (item.searchFields().toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
      this.totalSummaryText = "(filtered from " + this.fixtureCopy.length + " total entries)";
    }
    else {
      this.searchTextValue = "";
      this.isSearch = false;
      this.totalSummaryText = "";
      tempFixtures = this.fixtureCopy;
    }
    if (isUpdateEvent) {
      this.processPagination(tempFixtures, true);
    } else {
      this.processPagination(tempFixtures, false);
    }
  }

  updateFixtures() {
    var headers = new Headers();
    this.storage.get('Accesskey').then(val => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      this.http.get("http://www.sharbedge.co.uk/api/Values/Get/" + this.sharbTypeId, options).map(data => data.json())
        .subscribe(data => {
          this.fixtureCopy = [];
          data.forEach((item, index) => {
            var accaFixture = this.accaFixtures.find(x => x.id == item.Id)
            var x = new rowViewModel(item);
            if (accaFixture !== undefined)
              x.isSelected = true;
            this.fixtureCopy.push(x)
          });
          this.accaFixtures = this.fixtureCopy.filter(data => data.isSelected == true);
          if (this.currentSortValue !== undefined)
            this.sortFixtures(this.currentSortValue, false);
          if (this.isSearch) {
            this.searchFixtures(this.searchTextValue, true);
          } else {
            this.processPagination(this.fixtureCopy);
          }
        },
        err => {
          if (err.status == 401) {
            var response = JSON.parse(err.json());
            this.loader.dismiss();
            this.showAlert(response.title, response.subtitle)
            if (response.id == "1" || response.id == "2") {
              this.subscription.unsubscribe();
              this.storage.clear();
              this.navCtrl.setRoot(Login);
            }
            if (response.id == "3") {
              this.subscription.unsubscribe();
              this.navCtrl.setRoot(SubscribePage);
            }
          } else {
          }
        });
    })
  }


  ionViewDidLoad() {
    console.log("RMB");
  }

  goToPrevious(v) {
    this.counter -= 1;
    this.pageIndex = this.counter.toString();

    this.ProcessPageIndex();
    if (this.counter == 1)
      this.isPreviousDisabled = true;
    if (this.counter < this.totalPage)
      this.isNextDisabled = false;
    this.fixtures = this.fixtureCopy.slice((this.counter - 1) * this.pageLimit, this.counter * this.pageLimit);
  }

  goToNext(v) {
    this.counter += 1;
    this.pageIndex = this.counter.toString();
    this.ProcessPageIndex();
    if (this.counter == this.totalPage) {
      this.isNextDisabled = true;
    }
    if (this.counter > 1)
      this.isPreviousDisabled = false;
    this.fixtures = this.fixtureCopy.slice((this.counter - 1) * this.pageLimit, this.counter * this.pageLimit);
  }

  goToPage(v) {
    this.counter = parseInt(v);
    this.pageIndex = this.counter.toString();
    if (this.counter == 1) {
      this.isPreviousDisabled = true;
      this.isNextDisabled = false;
    }
    else if (this.counter == this.totalPage) {
      this.isPreviousDisabled = false;
      this.isNextDisabled = true;
    }
    else {
      this.isPreviousDisabled = false;
      this.isNextDisabled = false;
    }
    this.ProcessPageIndex();
    this.fixtures = this.fixtureCopy.slice((this.counter - 1) * this.pageLimit, this.counter * this.pageLimit);
  }

  ProcessPageIndex() {
    var mean = Math.round(this.totalPage / 3);
    var currentCounter = this.counter;
    var x;
    if (currentCounter <= mean) {
      x = [currentCounter, currentCounter + mean, currentCounter + 2 * mean];
    }
    if (currentCounter > mean) {
      x = [currentCounter - mean, currentCounter, currentCounter + mean];
    }

    for (var i = 0; i < this.pagination.length; i++) {
      var isVis = x.toString().includes((i + 1).toString());
      this.pagination[i].isVisible = isVis;
    }
  }

  processPagination(fixtureData: rowViewModel[], isUpdateEvent: boolean = true) {
    var tempPagination = [];
    this.totalPage = Math.ceil(fixtureData.length / this.pageLimit);
    var mean = Math.round(this.totalPage / 3);
    var index = [0, mean, 2 * mean];

    if (this.pagination.length == 0) {
      for (var i = 0; i < this.totalPage; i++) {
        var isVis = index.toString().includes(i.toString());
        var x = new PageViewModel({ id: i + 1, isVisible: isVis, isDisabled: false });
        tempPagination.push(x);
      }
      this.pagination = tempPagination;
    } else {
      this.ProcessPageIndex();
    }

    if (isUpdateEvent) {
      var y = (this.counter - 1) * this.pageLimit + 1;
      this.fixtures = fixtureData.slice(y, y + this.pageLimit);
    }
    else {
      this.fixtures = fixtureData.slice(0, this.pageLimit);
      this.counter = 1;
      this.pageIndex = "1";
    }
    this.totalRecords = fixtureData.length;
  }

  // { headers: this.headers}
  // http://www.sharbedge.co.uk/api/Values/
  getFixtures() {
    this.presentLoading();
    var headers = new Headers();
    this.storage.get('Accesskey').then((val) => {
      headers.append('Authorization', 'Bearer ' + val);
      var options = new RequestOptions({ headers: headers });
      this.http.get("http://www.sharbedge.co.uk/api/Values/Get/" + this.sharbTypeId, options).map(res => res.json())
        .subscribe(data => {
          data.forEach((element, index) => {
            var x = new rowViewModel(element);
            this.fixtureCopy.push(x)
          });
          this.processPagination(this.fixtureCopy, false);
          this.headerFooterVisible = false;
          this.loader.dismiss();
          this.setLastUpdatedTime();
        },
        err => {
          if (err.status == 401) {
            var response = JSON.parse(err.json());
            this.loader.dismiss();
            this.showAlert(response.title, response.subtitle)
            if (response.id == "1" || response.id == "2") {
              this.subscription.unsubscribe();
              this.storage.clear();
              this.navCtrl.setRoot(Login);
            }
            if (response.id == "3") {
              this.subscription.unsubscribe();
              this.navCtrl.setRoot(SubscribePage);
            }
          }
          else {
            this.loader.dismiss();
          }
        });
    })
  }

  showAlert(title: string, subTitle: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK']
    });
    alert.present();
  }


  loader;
  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 30000,
    });
    this.loader.present();
  }

  goToAccaPage() {
    this.navCtrl.push(AccaPage, { accaFixtures: this.accaFixtures });
  }

  clearAccaPage() {
    this.fixtures.forEach(e => e.isSelected = false);
    this.fixtureCopy.forEach(e => e.isSelected = false);
    this.accaFixtures = [];
  }

  accaFixtures: rowViewModel[] = [];
  AddAccaList(data: rowViewModel) {
    console.log("AddAccaList")
    if (data.isSelected)
      this.accaFixtures.push(data);
    else {
      let index: number = this.accaFixtures.findIndex(x => x.id == data.id)
      if (index !== -1) {
        this.accaFixtures.splice(index, 1);
      }
    }
  }

  UpdateOdds(data: rowViewModel) {
    this.navCtrl.push(OddsCutPage, { data: data });
  }


  selectRow(data: rowViewModel) {
    var tempIsSelected = (!data.isSelected);
    data.isSelected = tempIsSelected;
    this.fixtures.find(x => x.id == data.id).isSelected = tempIsSelected
    this.AddAccaList(data);
  }

  showSearchBar() {
    var isSearchVisible = !(this.headerFooterVisible);
    this.headerFooterVisible = isSearchVisible;
  }
}
