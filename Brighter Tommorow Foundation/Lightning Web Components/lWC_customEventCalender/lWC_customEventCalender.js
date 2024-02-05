import { LightningElement, track, wire } from 'lwc';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FullCalendarJS from '@salesforce/resourceUrl/Fullcalendar';
import fetchPrograms from '@salesforce/apex/CL_customEventCalender.fetchPrograms';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import IMAGES from "@salesforce/resourceUrl/DonationLogo";
import { NavigationMixin } from 'lightning/navigation';
import saveRegistrationFormData from '@salesforce/apex/CL_eventRegistrationForm.saveRegistrationFormData';
import getProgramsLookup from '@salesforce/apex/CL_eventRegistrationForm.getProgramsLookup';
import uId from '@salesforce/user/Id';

export default class LWC_customEventCalender extends NavigationMixin(LightningElement) {
   timeZone = TIME_ZONE;
    fullCalendarJsInitialised = false;
    title;
    startDate;
    endDate;

    eventsRendered = false;
    openSpinner = false; 
    openModal = false; 

    @track
    events = []; 
    eventOriginalData = [];

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

    //Get data from server - in this example, it fetches from the event object
    @wire(fetchPrograms)
    eventObj(value){
        this.eventOriginalData = value; //To use in refresh cache

        const {data, error} = value;
        if(data){
            //format as fullcalendar event object
            console.log(data);
            let events = data.map(event => {
                return { id : event.Id, 
                        title : event.Name, 
                        start : new Date(event.Start_Date__c).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}),
                        end : new Date(event.End_Date__c).toLocaleString(undefined, {timeZone: 'Asia/Kolkata'}),
                        allDay : event.All_Day__c,
                        s: event.StartDate__c,
                        e: event.EndDate__c,
                        address: event.Address__c
                    };
            });
            this.events = JSON.parse(JSON.stringify(events));
            console.log(this.events);
            this.error = undefined;
            if(! this.eventsRendered){
                //Add events to calendar
                const ele = this.template.querySelector("div.fullcalendarjs");
                $(ele).fullCalendar('renderEvents', this.events, true);
                this.eventsRendered = true;
            }
        }else if(error){
            this.events = [];
            this.error = 'No events are found';
        }
   }

   renderedCallback() {
      if (this.fullCalendarJsInitialised) {
         return;
      }
      this.fullCalendarJsInitialised = true;      
        Promise.all([
            loadScript(this, FullCalendarJS + "/FullCalendarJS/jquery.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/moment.min.js"),
            loadScript(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.js"),
            loadStyle(this, FullCalendarJS + "/FullCalendarJS/fullcalendar.min.css"),
        ])
        .then(() => {
          this.initialiseFullCalendarJs();
        })
        .catch((error) => {
        console.error({
            message: "Error occured on FullCalendarJS",
            error,
        });
        });
   }

    initialiseFullCalendarJs() {
        const ele = this.template.querySelector("div.fullcalendarjs");
        const modal = this.template.querySelector('div.modalclass');
        var self = this;

        function openActivityForm(startDate, endDate){
            self.startDate = startDate;
            self.endDate = endDate;
          //  self.openModal = true; 
        }
        $(ele).fullCalendar({
            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay",
            },
            defaultDate: new Date(), 
            defaultView : 'agendaWeek', 
            navLinks: true, 
            selectable: true, 

            select: function (startDate, endDate) {
                let stDate = startDate.format();
                let edDate = endDate.format();
                
                openActivityForm(stDate, edDate);
            },
            eventLimit: true, 
            events: this.events, 
        });
    }

    handleKeyup(event) {
        this.title = event.target.value;
    }
    
    //To close the modal form
    handleCancel(event) {
        this.openModal = false;
    }

   //To save the event
    handleSave(event) {
        this.openSpinner = true;
        
        this.openModal = false;

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
            saveRegistrationFormData({ jsonData: JSON.stringify(this.formsubmitdata), p_userId: this.recordId })
            .then( result => {
                if(result == 'Success'){
                    this.showToast('success','Success! Your Registration form has been submitted Successfully.');
                    this.personaldetails = false;
                    this.thankYouScreen = true;
                    this.thankYouScreenSucess = 'Success! Your Registration form has been submitted Successfully.';
                }
                
                else{
                    this.showToast('error','Please Contact The System Admistrator');
                    this.personaldetails = false;
                    this.thankYouScreen = true;
                    this.thankYouScreenSucess = 'Please Contact The System Admistrator';
                }
                this.openSpinner = false;

            })
            .catch( error => {
                console.log(error);
                this.openSpinner = false;

                this.error = error;
                console.log('error', error);
                this.showToast('error','Please Contact The System Admistrator');
                this.thankypuscreen = true;
                this.thankyouscreenSucess = 'Please Contact The System Admistrator';
            })
        }
        else{
            this.isSpiinerTrue = false;
        }
   }

    addEvent(event) {
        this.startDate = null;
        this.endDate = null;
        this.title = null;
        this.openModal = true;
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
}