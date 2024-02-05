public class CL_donationProgress {
    public CL_donationProgress() {
        
    }
    
    @AuraEnabled
    public static List<Donation_Request__c> getDonationRequests() {        
        List<Donation_Request__c> donationRequestList = new List<Donation_Request__c>();
        
        donationRequestList = [Select Id, Name, OwnerId,Progress_Value__c,Fund_Request__c,Remaining_Fund__c,Funds_Received__c,Reason_for_Donation_Request__c
                               From Donation_Request__c
                               Order By Name];
        
        return donationRequestList;
    }
    
    @AuraEnabled
    public static string InsertDonationRequestsReceived(String p_userId, String p_DRId, String p_Name, String p_DonorEmail, Decimal p_DonatedAmount) {
        List<User> userList = [SELECT Id,ProfileId,Profile.Name, ContactId,Contact.Name FROM User WHERE Id =: p_userId];
        Account  acc = new Account();
        
        Donation_Requests_Received__c d = new Donation_Requests_Received__c();
        Opportunity opp = new Opportunity();
        
        d.Donation_Request__c = p_DRId;
        d.Name = p_Name;
        d.Donor_Name__c = p_Name;
        d.Donor_Email__c = p_DonorEmail;
        d.Donated_Amount__c = p_DonatedAmount;
        if(userList.size()>0){
            if(userList[0].Profile.Name == 'Custom Partner Community'){
                contact con = [Select Id,Name,AccountId from Contact where id=:userList[0].ContactId];
                System.debug('ContactID'+con);
                acc = [Select Id,Name from Account where id=: con.AccountId];
                d.Donor__c = acc.id;
                opp.AccountId = acc.Id;
            }
        }
        // d.CreatedById = p_userId;
        insert d;
        
        opp.Name = p_Name;
        opp.StageName = 'Prospecting';
        opp.CloseDate = system.today();
        opp.Amount = p_DonatedAmount;
        opp.Donation_Request__c = p_DRId;
        opp.OwnerId = p_userId;
        insert opp;
        return 'true';
    }
}