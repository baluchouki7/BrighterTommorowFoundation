import { LightningElement, track,wire } from 'lwc';
import getDonor from '@salesforce/apex/CL_donorDashboard.getDonorData';
import uId from '@salesforce/user/Id';

export default class LWC_donorDashboard extends LightningElement {
    @track numberOfDonations;
    @track donorAmount;
    @track lastDonationDate;
    @track lastDonationAmount;
    @track recordId;
    @track donatedAmount;

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
}