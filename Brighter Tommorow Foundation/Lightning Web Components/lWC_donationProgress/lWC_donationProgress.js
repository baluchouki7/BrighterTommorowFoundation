import { LightningElement, wire, api, track} from 'lwc';
import DonationRequests from '@salesforce/apex/CL_donationProgress.getDonationRequests';
import InsertEvent from '@salesforce/apex/CL_donationProgress.InsertDonationRequestsReceived';
import uId from '@salesforce/user/Id'; 
//import { refreshApex } from '@salesforce/apex';

export default class LWC_donationProgress extends LightningElement {
   
    @track v_UserId=null;
    @track recordList = null; 
    @track userId = uId;

    connectedCallback(){
        this.userId = uId;
        console.log('inside connected , user Id ',this.userId);
        this.getDonationRequests();
    }
    
    getDonationRequests(){
        DonationRequests()
        .then(data => {
            console.log("GetDonationRequest:::", JSON.stringify(data));
            if(data){
                this.recordList = JSON.parse(JSON.stringify(data));
                this.recordList.forEach((e, index) => {
                    e['styleColor']='display:none';
                    if (!e.hasOwnProperty('Events')) {
                        e.Events = [];
                        e['style_eventcount']='display:none';
                    }
                    else {
                        e['style_eventcount']='display:contents';
                    }

                }) 
            }else{
                 this.showToast("info",'No Active Donation Requests','No Records');
            }
        });
    }

    f_flag_showhide(event){
        console.log('Input index->',event.target.dataset.index);
        console.log("recordList-->", JSON.stringify(this.recordList));
        if (this.recordList[event.target.dataset.index].styleColor == "display:none") {
            this.recordList[event.target.dataset.index].styleColor = "";
        } 
        else  {
            this.recordList[event.target.dataset.index].styleColor = "display:none";
        }
    }


    handle_DonorName(event){
        this.recordList[event.target.dataset.index].Donor_Name__c =  event.currentTarget.value;
    }
    handle_DonationAmount(event){
        this.recordList[event.target.dataset.index].Donated_Amount__c = event.currentTarget.value;
    }
    handle_DonorEmail(event){
        this.recordList[event.target.dataset.index].Donor_Email__c =  event.currentTarget.value;
    }
    

    submitDonation(event){
        let v_id = event.target.dataset.index;
        let v_recordList = [this.recordList[v_id]];
        if (v_recordList[0].Donor_Name__c == '') {
            this.f_msg_error('Error Updating record','Please enter the Subject');
            return false;
        }
        if (v_recordList[0].Donated_Amount__c == '') {
            this.f_msg_error('Error Updating record','Please enter the Expected Quantity');
            return false;
        }
        if (v_recordList[0].Donor_Email__c == '') {
            this.f_msg_error('Error Updating record','Please enter the Description');
            return false;
        }
        
        InsertEvent({
            p_userId: this.userId,
            p_DRId: v_recordList[0].Id,
            p_Name: v_recordList[0].Donor_Name__c,
            p_DonatedAmount: v_recordList[0].Donated_Amount__c,
            p_DonorEmail: v_recordList[0].Donor_Email__c
        })
        .then((result)=>{
            console.log('result---',result);
            this.getDonationRequests();
            alert('Donation Submitted Successfully');
        })
    }
}