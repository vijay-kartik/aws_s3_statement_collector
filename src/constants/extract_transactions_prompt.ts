const EXTRACT_TRANSACTIONS_PROMPT: String = `Your task is to efficiently extract the transactions from the following CSV data.
Your response should be a json containing a table of transactions, with the following columns:
- Date : date must follow format of dd/mm/yyyy
- Transaction details
- Amount: should be pure float values. No unnecessary commas.`;
export default EXTRACT_TRANSACTIONS_PROMPT;
