public with sharing class CL_CustomPageController {	
   
    public String firstName{get;set;}
    public String lastName{get;set;}
    public String comapany{get;set;}
    public String mobile{get;set;}
    public String statusOptions { get; set; }
     Lead l=new Lead();
  
   
    
    public List<SelectOption> getItems() {
		List<SelectOption> options = new List<SelectOption>();
		options.add(new SelectOption('Open - Not Contacted','Open - Not Contacted')); //SelectOption(id,value)
		options.add(new SelectOption('Working - Contacted','Working - Contacted'));
		options.add(new SelectOption('Closed - Converted','Closed - Converted'));
		options.add(new SelectOption('Closed - Not Converted','Closed - Not Converted'));
		return options;
	}
    
    public PageReference submitLead(){
       System.debug(' method calling');
        l.FirstName=firstName;
		l.LastName=lastName;
		l.Company=comapany;
		l.MobilePhone=mobile;
		l.Status=statusOptions;
		insert l;
        return null;
    }    
  
    
}