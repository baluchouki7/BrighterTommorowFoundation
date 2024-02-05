public class CL_programUpdates {
    @AuraEnabled(cacheable=true)
    public static List<Program__c> getProgramsWithImages() {
        List<Program__c> prgList =  [SELECT Id, Name,Description__c, Program_Image__c,Start_Date__c,StartDate__c,ProgramHeader__c,Public_Image_Link__c
                                     FROM Program__c where Start_Date__c>=: system.today()];
        system.debug('prgList size:::'+prgList.size());
        system.debug('prgList:::'+prgList);
        return prgList;
    }
}