import { LightningElement, wire } from 'lwc';
import getProgramsWithImages from '@salesforce/apex/CL_programUpdates.getProgramsWithImages';

export default class lWC_programUpdates extends LightningElement {
    carouselItems = [];
    @wire(getProgramsWithImages)
    wiredPrograms({ error, data }) {
        if (data) {
            console.log('Data:', data);
            const records = data;
            this.carouselItems = this.processRecords(records);
            console.log('carouselItems:', this.carouselItems);
        } else if (error) {
            console.error('Error fetching records:', error);
        }
    }
    
    processRecords(records) {
        console.log('Records:', records);
        const decoder = new DOMParser();
        const extractImageUrls = (html) => {
            const doc = decoder.parseFromString(html, 'text/html');
            const imgElements = doc.querySelectorAll('img');
            return Array.from(imgElements).map(img => img.src);
        };
        return records.map((record, index) => ({
            id: index + 1,
            src: record.Public_Image_Link__c,           // record.Program_Image__c ? extractImageUrls(record.Program_Image__c)[0] : '',
            header: record.Name +', '+ record.StartDate__c,
            description: record.Description__c || '',
            altText: record.Description__c || '',
            href: 'javascript:void(0);',
        }));
    }
}