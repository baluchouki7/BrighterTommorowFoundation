import { LightningElement,track } from 'lwc';
import IMAGES from "@salesforce/resourceUrl/DonationLogo";
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveRegistrationFormData from '@salesforce/apex/CL_eventRegistrationForm.saveRegistrationFormData';
import getProgramsLookup from '@salesforce/apex/CL_eventRegistrationForm.getProgramsLookup';
import uId from '@salesforce/user/Id';

export default class LWC_eventRegistrationForm extends NavigationMixin(LightningElement) {
    Logo = IMAGES;
    @track personaldetails = true;
    @track recordId;
    isSpiinerTrue = false;
    eventSelected;
    Name;
    Phone;
    Email;
    street;
    City;
    State;
    Country;
    PostalCode;
    GuestName;
    GuestSelection;
    UpdatesSelection;
    Comments;
    experience;
    @track EventOptions;
    @track guestTrue;
    Volunteer;
    @track volunteerTrue;

    connectedCallback() {
        this.getPrograms();
        this.recordId = uId;
    }

    showToast(toastType, toastMsg) {
        const event = new ShowToastEvent({
          title: toastMsg,
          message: toastType,
          variant: toastType,
          mode: "dismissable"
        });
        this.dispatchEvent(event);
    }

    get Options(){
        return [
            { label:'YES', value:'Yes'},
            { label:'NO', value:'No'}
        ];
    }

    handleKeyChange(event) {
        if (event.target.name == 'eventSelected') {
            this.eventSelected = event.target.value;
        }

        if (event.target.name == 'Name') {
            this.Name = event.target.value;
        }

        if (event.target.name == 'Phone') {
            this.Phone = event.target.value;
        }

        if (event.target.name == 'Email') {
            this.Email = event.target.value;
        }

        if (event.target.name == 'street') {
            this.street = event.target.value;
        }

        if (event.target.name == 'City') {
            this.City = event.target.value;
        }

        if (event.target.name == 'State') {
            this.State = event.target.value;
        }

        if (event.target.name == 'Country') {
            this.Country = event.target.value;
        }

        if (event.target.name == 'PostalCode') {
            this.PostalCode = event.target.value;
        }

        if (event.target.name == 'Volunteer') {
            this.Volunteer = event.target.value;
            if(this.Volunteer == 'Yes'){
                this.volunteerTrue = true;
            }
            else{
                this.volunteerTrue = false;
            }
        }

        if (event.target.name == 'GuestSelection') {
            this.GuestSelection = event.target.value;
            if(this.GuestSelection == 'Yes'){
                this.guestTrue = true;
            }
            else{
                this.guestTrue = false;
            }
        }

        if (event.target.name == 'GuestName') {
            this.GuestName = event.target.value;
        }

        if (event.target.name == 'UpdatesSelection') {
            this.UpdatesSelection = event.target.value;
        }

        if (event.target.name == 'Comments') {
            this.Comments = event.target.value;
        }

        if (event.target.name == 'experience') {
            this.experience = event.target.value;
        }
    }

    getPrograms(){
        let options = [];
        getProgramsLookup() 
            .then(data => {
                console.log('data ',data);
                options = JSON.parse(JSON.stringify(data));
                console.log('options::: ',options);
                this.EventOptions = options;
                console.log('EventOptions',this.EventOptions);
            });
            options = options.filter((thing, index) => {
                const _thing = JSON.stringify(thing);
                return index === options.findIndex(obj => {
                    return JSON.stringify(obj) === _thing;
                });
            });
            this.EventOptions = options;
            console.log('EventOptions',this.EventOptions);
    }

    validateForm2() {
        let isValid = true;
        let inputFields = this.template.querySelectorAll('.validateinput2');
        inputFields.forEach(inputField => {
            if (!inputField.checkValidity()) {
                inputField.reportValidity();
                isValid = false;
            }
        });
        return isValid;
    }

    handleClicksubmit() {
        this.isSpiinerTrue = true;
        let e = this.Email;
        this.formsubmitdata = {
            'eventSelected': this.eventSelected,'Name': this.Name,'Phone': this.Phone,'Email': this.Email,'street': this.street,
            'City': this.City,'State': this.State,'Country': this.Country,'PostalCode': this.PostalCode,'GuestSelection': this.GuestSelection,
            'GuestName': this.GuestName,'UpdatesSelection': this.UpdatesSelection, 'Comments': this.Comments, 'experience': this.experience,
            'Volunteer': this.Volunteer
        };
        console.log('formsubmitedd', this.formsubmitdata);
        console.log('formdata', JSON.stringify(this.formsubmitdata));
        console.log('submitValidate', this.validateForm2());

        if (this.validateForm2()) {
           // this.isSpiinerTrue = true;
            saveRegistrationFormData({ jsonData: JSON.stringify(this.formsubmitdata), p_userId: this.recordId })
                .then((result) => {
                    if(result == 'Success'){
                        this.showToast('success','Success! Your Registration form has been submitted Successfully.');
                        this.personaldetails = false;
                        this.thankYouScreen = true;
                        this.thankYouScreenSucess = 'Success! Your Registration form has been submitted Successfully.';
                        //this.isSpiinerTrue = true;
                    }
                    
                    else{
                        this.showToast('error','Please Contact The System Admistrator');
                        this.personaldetails = false;
                        this.thankYouScreen = true;
                        this.thankYouScreenSucess = 'Please Contact The System Admistrator';
                    }
                })
                .catch((error) => {
                    this.error = error;
                    console.log('error', error);
                    this.showToast('error','Please Contact The System Admistrator');
                    this.thankypuscreen = true;
                    this.thankyouscreenSucess = 'Please Contact The System Admistrator';
                   // this.isSpiinerTrue = true;
                });
                this.isSpiinerTrue = false;
        }
        else{
            this.isSpiinerTrue = false;
        }
    }

}