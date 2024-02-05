public class CL_programLocationController {
	@AuraEnabled(cacheable=true)
    public static List<Program__c> getProgramLocations() {
        return [SELECT Id, Name, City__c, Street__c, State__c, Country__c, Postal_Code__c,
                Location__Longitude__s, Location__Latitude__s, Location__c,Address__c 
                FROM Program__c where Location__Longitude__s != null AND Location__Latitude__s != null];
    }
}