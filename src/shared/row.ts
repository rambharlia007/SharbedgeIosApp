export class rowViewModel {
    eventName: string;
    eventDateTime: string;
    marketDisplayName: string;
    bookmakerName: string;
    couponName: string;
    backOdds: number;
    backOddsFra: string
    layOdds: number;
    fivePercentUpdatedAt: string;
    lastConfirmedAt: string;
    oddsUpdateCount: number;
    isChildVisible: boolean = false;
    marketId: number;
    eventId: number;
    id: number;
    isSelected: boolean = false;
    size: number;
    fivePercentColumnValue: number;
    lastConfirmedColumnValue: number;
    get when() {
        var d = new Date(this.eventDateTime);
        var now_utc = new Date(d.getUTCFullYear(),
            d.getUTCMonth(),
            d.getUTCDate(),
            d.getUTCHours(),
            d.getUTCMinutes(),
            d.getUTCSeconds()); //Month is 0 based
        var monthData = now_utc.getMonth() + 1;
        var hoursData = now_utc.getHours() + 1;

        return ('0' + now_utc.getDate()).slice(-2) + '-' + ('0' + monthData).slice(-2) + "\n" + ' ' + ('0' + hoursData).slice(-2) + ':' + ('0' + now_utc.getMinutes()).slice(-2);
    }

    get coupon() {
        return this.bookmakerName + " " + this.couponName;
    }

    get BL() {
        return "<div class='colorBlue'>" +
            this.backOdds +
            "</div> \n <div class='colorPink'>" +
            this.layOdds +
            "</div>";

    }

    get fivePercent() {
        return this.getDiffInMinutes(this.fivePercentColumnValue);
    }

    get LC() {
        return this.getDiffInMinutes(this.lastConfirmedColumnValue);
    }

    get Arb() {
        var oddsStatus = this.oddsUpdateCount % 3;

        if (oddsStatus === 0) {
            return "<div class= 'colorGreen'>" +
                Math.round((this.backOdds / this.layOdds) * 100 - 100) +
                '%' +
                "</div>";
        } else if (oddsStatus === 1) {
            return "<div class= 'colorOrange'>" +
                Math.round((this.backOdds / this.layOdds) * 100 - 100) +
                '%' +
                "</div>";
        } else if (oddsStatus === 2) {
            return "<div class= 'colorRed'>" +
                Math.round((this.backOdds / this.layOdds) * 100 - 100) +
                '%' +
                "</div>";
        } else if (oddsStatus === 3) {
            return "<div class= 'colorGreen'>" +
                Math.round((this.backOdds / this.layOdds) * 100 - 100) +
                '%' +
                "</div>";
        }
    }

    getDiffInMinutes(data: number) {
        let finalValue: number = 99;
        if (data != null) {
            if (data < 10) {
                finalValue = data / 10;
            }   
            else if (data > 990) {
                finalValue = 99;
            }
            else {
                finalValue = Math.round(data / 10)
            }
        }
        return "<div class='colorBlue'>" + finalValue + "</div>";
    }


    showOddsCutDetails() {
        console.log(this.isChildVisible);
        if (this.isChildVisible)
            this.isChildVisible = false;
        else
            this.isChildVisible = true;
    }


    constructor(data: any) {
        this.id = data.Id;
        this.eventName = data.EventName;
        this.eventDateTime = data.EventDateTime;
        this.marketDisplayName = data.MarketDisplayName;
        this.bookmakerName = data.BookmakerName;
        this.couponName = data.CouponName;
        this.backOdds = data.BackOdds;
        this.layOdds = data.ExchangeType.LayOdds;
        this.oddsUpdateCount = data.OddsUpdateCount;
        this.fivePercentUpdatedAt = data.FivePercentUpdatedAt;
        this.lastConfirmedAt = data.LastConfirmedAt;
        this.backOddsFra = data.BackOddsFra;
        this.size = data.ExchangeType.Size;
        this.marketId = data.MarketId;
        this.eventId = data.EventId;
        this.fivePercentColumnValue = data.FivePercentColumnValue;
        this.lastConfirmedColumnValue = data.LastConfirmedColumnValue
    }

    updateFixtures(data: any) {
        this.id = data.Id;
        this.eventName = data.EventName + " " + Math.floor(Math.random() * (1000)) + 1;
        this.eventDateTime = data.EventDateTime;
        this.marketDisplayName = data.MarketDisplayName + " " + Math.floor(Math.random() * (1000)) + 1;
        this.bookmakerName = data.BookmakerName + " " + Math.floor(Math.random() * (1000)) + 1;
        this.couponName = data.CouponName + " " + Math.floor(Math.random() * (1000)) + 1;
        this.backOdds = data.BackOdds;
        this.layOdds = data.ExchangeType.layOdds;
        this.oddsUpdateCount = data.OddsUpdateCount;
        this.backOddsFra = data.BackOddsFra;
        this.size = data.ExchangeType.Size;
    }
    searchFields() {
        return this.coupon + "" + this.eventName + "" + this.marketDisplayName;
    }
}