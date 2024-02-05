public class CL_donorDashboard {
        
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getDonationList(String recordId) {
        User u = [SELECT Id, ContactId,Contact.Name FROM User WHERE Id =: recordId];
        contact con = [Select Id,Name,AccountId from Contact where id=:u.ContactId];
        Account acc = [Select Id,Name from Account where id=: con.AccountId];
        System.debug('ContactID'+con);
        system.debug('recordId:::'+recordId);
        List<Opportunity> oppList = [SELECT Id,Name,Amount,Payment_Method__c,CreatedDate,Donation_Request_Name__c  
                                     FROM Opportunity where AccountId =: con.AccountId Order By CreatedDate];
        system.debug('oppList:::'+oppList);
        return oppList;
    }
    
	@AuraEnabled(cacheable=true)
    public static string getDonorData(string recordId){
        system.debug('recordId:::'+recordId);
        User u = [SELECT Id, ContactId,Contact.Name FROM User WHERE Id =: recordId];
        system.debug('u:::'+u);
        contact con = [Select Id,Name,AccountId from Contact where id=:u.ContactId];
        System.debug('ContactID'+con);
        
        Account acc = [Select Id,Name,Number_of_Donations__c,Total_Donation__c,(Select id,Name,createdDate,Amount from Opportunities), 
                       (Select Id,name,Donated_Amount__c from  Donation_Requests_Receiveds__r)
						from Account where Id =: con.AccountId];
        decimal donatedAmount = 0;
        if(acc.Donation_Requests_Receiveds__r.size() > 0){
            for(Donation_Requests_Received__c drr: acc.Donation_Requests_Receiveds__r){
                donatedAmount += drr.Donated_Amount__c;
            }
        }
        donorData d = new donorData();
        d.numberOfDonations = string.valueOf(acc.Number_of_Donations__c);
        d.donorAmount = string.valueOf(acc.Total_Donation__c);
        d.lastDonationDate = date.valueOf(acc.Opportunities[0].createdDate);
        d.lastDonationAmount = string.valueOf(acc.Opportunities[0].Amount);
        d.donatedAmount = string.valueOf(donatedAmount);
        return json.serialize(d);
    }
    
    public class donorData{
        public string numberOfDonations;
        public string donorAmount;
        public Date lastDonationDate;
        public string lastDonationAmount;
        public string donatedAmount;
       // public string thisYearDonation;
       // public string lastYearDonation;
    }
}