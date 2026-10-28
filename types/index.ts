export interface Feature {
  Feature_ID: string;
  Feature_Name: string;
  Agent_Type: string;
  Category: string;
  Quarter_Planned: string;
  Replicability_Score: number;
  Primary_Client: string;
  Additional_Clients: string;
  Platform_vs_Custom: string;
  ARR_Amount: number;
  Revenue_Type: string;
  Contract_Status: string;
  Pipeline_Stage: string;
  Conversion_Probability: number;
  Current_Status: string;
  Completion_Percent: number;
  Target_Completion_Date: string;
  Effort_Estimate_Weeks: number;
  Revenue_at_Risk: string;
  Priority_Score: number;
  Engineering_Notes: string;
  Management_Notes: string;
  Client_Count: number;
  Deal_Close_Date: string;
  Days_to_Close: number;
  Multi_Client_Benefit: string;
  Effort_T_Shirt_Size: string;
  Engineering_Complexity: string;
  Dependencies: string;
  Team_Required: string;
  Priority_Tier: string;
  Revenue_Impact_Type: string;
  Weighted_ARR: number;
  Assigned_To: string;
  Sprint_Assignment: string;
  JIRA_Ticket_Count: number;
  Created_Date: string;
  Target_Start_Date: string;
  Sales_Notes: string;
  Manual_Override: string;
  Manual_Override_Score: number;
}

export interface JiraTicket {
  JIRA_Ticket_ID: string;
  Title: string;
  Status: string;
  Category: string;
  Client_Name: string;
  Effort_T_Shirt_Size: string;
  Story_Points: number;
  Mapped_Feature_ID: string;
}

export interface SalesOpportunity {
  Opportunity_ID: string;
  Opportunity_Name: string;
  Account_Name: string;
  Stage: string;
  ARR_Value: number;
  Close_Date: string;
  Probability: number;
  Owner: string;
  Agent_Type: string;
  Mapped_Feature_ID: string;
  Status: string;
  Created_Date: string;
  Last_Activity_Date: string;
  Notes: string;
  Weighted_ARR: number;
  Days_in_Stage: number;
}

export interface FilterState {
  quarters: string[];
  clients: string[];
  statuses: string[];
  tiers: string[];
  agentTypes: string[];
}
