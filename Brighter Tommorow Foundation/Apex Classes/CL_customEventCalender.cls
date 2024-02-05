public class CL_customEventCalender {
	 public class EventException extends Exception {}
    
    @AuraEnabled(cacheable=true)
    public static List<Program__c> fetchPrograms() {
        return [SELECT Id, Name,Description__c,End_Date__c,Start_Date__c,All_Day__c,StartDate__c,EndDate__c,Address__c
                FROM Program__c ORDER BY Start_Date__c Asc];
    }
}