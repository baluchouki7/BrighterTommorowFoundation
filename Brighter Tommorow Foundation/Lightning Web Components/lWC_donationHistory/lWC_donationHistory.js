import { LightningElement, track,wire } from 'lwc';
import getDonor from '@salesforce/apex/CL_donorDashboard.getDonorData';
import getDonationHistory from '@salesforce/apex/CL_donorDashboard.getDonationList';
import uId from '@salesforce/user/Id';

export default class LWC_donationHistory extends LightningElement {
    @track numberOfDonations;
    @track donorAmount;
    @track lastDonationDate;
    @track lastDonationAmount;
    @track donatedAmount;
   
    @track recordId;

    @track page = 1; //this will initialize 1st page
    @track items = []; //it contains all the records.
    @track startingRecord = 1; //start record position per page
    @track endingRecord = 0; //end record position per page
    @track pageSize = 20; //default value we are assigning
    @track totalRecountCount = 0; //total record count received from all retrieved records
    @track totalPage = 0; //total number of page is needed to display all records
    @track donationList=[];

    connectedCallback() {
        this.getDonorData();
        this.recordId = uId;
    }

    
    getDonorData() {
        this.recordId = uId;
        console.log('uID:::',uId);
        console.log('recordId:::',this.recordId);
        getDonor({ 'recordId': this.recordId }).then((result) => {
            console.log('result', result);
            // Map the data 
            this.donorData = JSON.parse(result);
            console.log('donorData', this.donorData);
            console.log('donorDataName', this.donorData.Name);
            this.numberOfDonations = this.donorData.numberOfDonations;
            this.donorAmount = this.donorData.donorAmount;
            this.lastDonationDate = this.donorData.lastDonationDate;
            this.lastDonationAmount = this.donorData.lastDonationAmount;
            this.donatedAmount = this.donorData.donatedAmount;
           
        }).catch(error => {
            console.error('error::',error);
        });
    }

    @wire(getDonationHistory, { recordId:'$recordId'})
    wiredDonations({
        error,
        data
    }) {
        if (data) {
            this.showSpinner = true;
            var tempDonList = [];
            for (var i = 0; i < data.length; i++) {
                let tempRecord = Object.assign({}, data[i]); //cloning object  
                tempRecord.recordLink = "/" + tempRecord.Id;
                tempDonList.push(tempRecord);
            }

            this.items = tempDonList;
            this.totalRecountCount = tempDonList.length; 
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.donationList = this.items.slice(0, this.pageSize);
            this.endingRecord = this.pageSize;
            this.count = this.donationList.length;

            this.showSpinner = false;
        } else if (error) {
            console.log('error');
            this.error = error;
        }
    }

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    displayRecordPerPage(page){

        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);
        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 
        this.donationList = this.items.slice(this.startingRecord, this.endingRecord);
        this.startingRecord = this.startingRecord + 1;
    }


    doSorting(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.sortData(this.sortBy, this.sortDirection);
    }

    sortData(fieldname, direction) {
        let parseData = JSON.parse(JSON.stringify(this.donationList));
        // Return the value stored in the field
        let keyValue = (a) => {
            return a[fieldname];
        };
        // cheking reverse direction
        let isReverse = direction === 'asc' ? 1 : -1;
        // sorting data
        parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; // handling null values
            y = keyValue(y) ? keyValue(y) : '';
            // sorting values based on direction
            return isReverse * ((x > y) - (y > x));
        });
        this.donationList = parseData;
    }

    @track donationColumns = [
        { 
            label: 'Donation Name', 
            fieldName: 'Name', 
            type: 'text',  
            sortable: true
        },
        { 
            label: 'Donation Request', 
            fieldName: 'Donation_Request_Name__c', 
            type: 'text',  
            sortable: true
        },
        {
            label: 'Amount',
            fieldName: 'Amount',
            type: 'text',
            sortable: true
        },
        {
            label: 'Payment Method',
            fieldName: 'Payment_Method__c',
            type: 'text',
            sortable: true
        },
        {
            label: 'Date',
            fieldName: 'CreatedDate',
            type: 'date',
            sortable: true
        },
        
    ];
}