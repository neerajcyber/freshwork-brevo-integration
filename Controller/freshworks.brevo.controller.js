const axios = require("axios");
const { Freshteam } = require("@freshworks/api-sdk");
const SibApiV3Sdk = require('sib-api-v3-sdk');

const api_Key = process.env.FRESHWORKS_API_KEY;
const domain = process.env.FRESHWORKS_DOMAIN;
const brevo_api_key = process.env.BREVO_API;
module.exports = {
    insertDataPerPage: async (req, res) => {
        const {page} = req.query
     
        
        const FRESHWORKS_API_URL = `https://${domain}/crm/sales/api/contacts/view/31008373064`;

        try {
       
            const response = await axios.get(FRESHWORKS_API_URL, {
                headers: {
                    Authorization: `Token token=${api_Key}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    sort_type: 'desc', // Sort results in ascending order
                    sort_by: 'created_at', // Sort by the created_at field
                    page: page , // Fetch the first page of results
                    per_page: 10, // Fetch 100 results per page
                    include: 'deals', // Include related deals in the response
                    updated_since: '2024-01-01T00:00:00Z' // Fetch records updated since this timestamp
                }
            });
            let defaultClient = SibApiV3Sdk.ApiClient.instance;

            let apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = brevo_api_key;

            let apiInstance = new SibApiV3Sdk.ContactsApi();
            let allgetContacts = await apiInstance.getContacts({ });

            for (let i = 0; i < response?.data?.contacts?.length; i++) {
                let defaultClient = SibApiV3Sdk.ApiClient.instance;

                let apiKey = defaultClient.authentications['api-key'];
                apiKey.apiKey = brevo_api_key;

                let apiInstance = new SibApiV3Sdk.ContactsApi();
                let contactEmail = response?.data?.contacts[i].email;
                // Check if the contact already exists in Brevo
                let getContacts = await apiInstance.getContacts({ email: contactEmail });
            
                if (getContacts.totalCount > 0) {
                    console.log(`Contact with email ${contactEmail} already exists in Brevo.`);
                    continue; // Skip this contact
                }
                let createContact = new SibApiV3Sdk.CreateContact();

                createContact.email = response?.data?.contacts[i].email;
                createContact.attributes = {
                    FIRSTNAME: response?.data?.contacts[i].first_name,
                    LASTNAME: response?.data?.contacts[i].last_name,
                    ADDRESS:response?.data?.contacts[i].address,
                    CF_NAME: response?.data?.contacts[i].custom_field.cf_name,
                    CF_LANGUAGE: response?.data?.contacts[i].custom_field.cf_language,
                    CF_FREE_PARKING: response?.data?.contacts[i].custom_field.cf_free_parking,
                    CF_EV_CHARGER: response?.data?.contacts[i].custom_field.cf_ev_cherger,
                    CF_PHONE: response?.data?.contacts[i].custom_field.cf_phone,
                    CF_EV_CHARGER_BRAND: response?.data?.contacts[i].custom_field.cf_ev_charger_brand,
                    CF_EV_CHARGER_MODEL_NUMBER_OR_NAME: response?.data?.contacts[i].custom_field.cf_ev_charger_model_number_or_name,
                    CF_EV_CHARGER_INSTALLER: response?.data?.contacts[i].custom_field.cf_ev_charger_installer,
                    CF_PROPRIETY_TYPE: response?.data?.contacts[i].custom_field.cf_propriety_type,
                    CF_PROVINCE: response?.data?.contacts[i].custom_field.cf_province,
                    CF_CONTACT_PERSONA: response?.data?.contacts[i].custom_field.cf_contact_persona,
                    CF_EMAIL_MARKETING: response?.data?.contacts[i].custom_field.cf_email_marketing,
                    CF_EMAIL_MARKETING_TYPE: response?.data?.contacts[i].custom_field.cf_email_marketing_type,
                    CF_EV_CHARGER_POWER_VALUE: response?.data?.contacts[i].custom_field.cf_ev_charger_power_value,
                    CF_CONNECTOR_COUNT: response?.data?.contacts[i].custom_field.cf_connector_count,
                    CF_CONNECTOR_TYPE: response?.data?.contacts[i].custom_field.cf_connector_type,
                    WORK_NUMBER: response?.data?.contacts[i].work_number,
                    WHATSAPP_SUBSCRIPTION_STATUS: response?.data?.contacts[i].whatsapp_subscription_status

                }

                createContact.listIds = [3]

                apiInstance.createContact(createContact).then(function (data) {
                    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                }, function (error) {
                    console.error(error);
                });
            }


            return res.status(200).send({ data:response.data});
        } catch (error) {
            return res.status(400).json({ error: error.message })
        }
    },
    insertContactById: async (req, res) => {
        const contactId = req.params.id;

        if (!contactId) {
            return res.status(400).json({ error: 'Contact ID is required' });
        }

        const FRESHWORKS_CONTACT_URL = `https://${domain}/crm/sales/api/contacts/${contactId}`;

        try {
            // Fetch contact details from Freshworks CRM
            const response = await axios.get(FRESHWORKS_CONTACT_URL, {
                headers: {
                    Authorization: `Token token=${api_Key}`,
                    'Content-Type': 'application/json'
                }
            });

            const contact = response.data.contact;

            if (!contact) {
                return res.status(404).json({ error: 'Contact not found in Freshworks CRM' });
            }

            let defaultClient = SibApiV3Sdk.ApiClient.instance;
            let apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = brevo_api_key;
            let apiInstance = new SibApiV3Sdk.ContactsApi();

            // Check if the contact already exists in Brevo
            let getContacts = await apiInstance.getContacts({ email: contact.email });
            if (getContacts.totalCount > 0) {
                return res.status(200).json({ message: 'Contact already exists in Brevo' });
            }

            let createContact = new SibApiV3Sdk.CreateContact();
            createContact.email = contact.email;
            createContact.address = contact.address;
            createContact.attributes = {
                FIRSTNAME: contact.first_name,
                LASTNAME: contact.last_name,
                ADDRESS:response?.data?.contacts[i].address,
                CF_NAME: contact.custom_field.cf_name,
                CF_LANGUAGE: contact.custom_field.cf_language,
                CF_FREE_PARKING: contact.custom_field.cf_free_parking,
                CF_EV_CHARGER: contact.custom_field.cf_ev_cherger,
                CF_PHONE: contact.custom_field.cf_phone,
                CF_EV_CHARGER_BRAND: contact.custom_field.cf_ev_charger_brand,
                CF_EV_CHARGER_MODEL_NUMBER_OR_NAME: contact.custom_field.cf_ev_charger_model_number_or_name,
                CF_EV_CHARGER_INSTALLER: contact.custom_field.cf_ev_charger_installer,
                CF_PROPRIETY_TYPE: contact.custom_field.cf_propriety_type,
                CF_PROVINCE: contact.custom_field.cf_province,
                CF_CONTACT_PERSONA: contact.custom_field.cf_contact_persona,
                CF_EMAIL_MARKETING: contact.custom_field.cf_email_marketing,
                CF_EMAIL_MARKETING_TYPE: contact.custom_field.cf_email_marketing_type,
                CF_EV_CHARGER_POWER_VALUE: contact.custom_field.cf_ev_charger_power_value,
                CF_CONNECTOR_COUNT: contact.custom_field.cf_connector_count,
                CF_CONNECTOR_TYPE: contact.custom_field.cf_connector_type,
                WORK_NUMBER: contact.work_number,
                WHATSAPP_SUBSCRIPTION_STATUS: contact.custom_field.whatsapp_subscription_status
            };
            createContact.listIds = [3];

            // Insert contact into Brevo
            apiInstance.createContact(createContact).then(function (data) {
                console.log('API called successfully. Returned data: ' + JSON.stringify(data));
                return res.status(200).json({ message: 'Contact inserted into Brevo successfully', data });
            }, function (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to insert contact into Brevo', details: error });
            });

        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
