public class CL_eventRegistrationForm {
    @AuraEnabled(cacheable=true)
    public static List <Map<String, Object>> getProgramsLookup(){
        List<Program__c> programMasterList = new List<Program__c>();
        programMasterList = [Select Id,Name from Program__c];
        system.debug('programMasterList:::'+programMasterList.size());
        List <Map<String, Object>> mapProgramMasterList = new List <Map<String, Object>>();
        
        for(Program__c p: programMasterList){
            Map<String,Object> createZoneMasterMap = new Map<String,Object>();
            createZoneMasterMap.put('label',p.Name);
            createZoneMasterMap.put('value', p.Id);
            mapProgramMasterList.add(createZoneMasterMap);
        }
        return mapProgramMasterList;
    }
    
    @AuraEnabled
    public static String saveRegistrationFormData(string p_userId, string jsonData){
        try{
            Map<String,Object> formDataMap = (Map<String,object>) JSON.deserializeUntyped(jsonData);
            List<User> userList = [SELECT Id,ProfileId,Profile.Name, ContactId,Contact.Name FROM User WHERE Id =: p_userId];
            Account  acc = new Account();
            Program_Registration__c pr = new Program_Registration__c();
            if(userList.size()>0){
                if(userList[0].Profile.Name == 'Custom Partner Community'){
                    contact con = [Select Id,Name,AccountId from Contact where id=:userList[0].ContactId];
                    System.debug('ContactID'+con);
                    acc = [Select Id,Name from Account where id=: con.AccountId];
                    pr.Donor_Name__c = acc.Id;
                }
            }
            String recordId = (String)formDataMap.get('eventSelected');
            pr.Program__c = Id.valueOf(recordId);
            pr.Name = (String)formDataMap.get('Name');
            pr.Phone__c = (String)formDataMap.get('Phone');
            pr.Email__c = (String)formDataMap.get('Email');
            pr.Street__c = (String)formDataMap.get('street');
            pr.City__c = (String)formDataMap.get('City');
            pr.State__c = (String)formDataMap.get('State');
            pr.Country__c = (String)formDataMap.get('Country');
            pr.Postal_Code__c = (String)formDataMap.get('PostalCode');
            pr.Guest_Name__c = (String)formDataMap.get('GuestName');
            pr.Will_you_have_a_guest_with_you__c = (String)formDataMap.get('GuestSelection');
            pr.Would_you_like_to_be_updated_about_the_u__c = (String)formDataMap.get('UpdatesSelection');
            pr.Do_You_have_Experience_V__c = (String)formDataMap.get('experience');
            pr.Do_you_want_to_Volunteer_this_Event__c = (String)formDataMap.get('Volunteer');
            pr.Comments__c = (String)formDataMap.get('Comments');
            insert pr;
            return 'Success';
        }
        catch(exception e){
            system.debug('e:::'+e);
            return 'Error';
        }
    }
}