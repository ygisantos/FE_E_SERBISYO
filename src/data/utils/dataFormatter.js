import barangayData from '../datasets/barangay.data.json';

export const formatDataForPrompt = () => {
  const data = {
    documents: Object.values(barangayData.documents)
      .map(doc => ({
        name: doc.name,
        requirements: doc.requirements,
        fee: doc.fee,
        processingTime: doc.processingTime
      })),
    services: Object.values(barangayData.services)
      .map(service => ({
        name: service.name,
        description: service.description,
        requirements: service.requirements
      })),
    programs: {
      health: barangayData.programs.health,
      social: barangayData.programs.social
    },
    contactInfo: barangayData.barangayInfo.contactInfo,
    guidelines: barangayData.guidelines
  };

  return `
Bilang Barangay Santol Digital Assistant, gamitin ang sumusunod na impormasyon:

DOKUMENTO AT SERBISYO:
${data.documents.map(doc => `
**${doc.name}**
Bayad: **${doc.fee}**
Processing Time: **${doc.processingTime}**
Requirements:
${doc.requirements.map(req => `- **${req}**`).join('\n')}`).join('\n')}

MGA PROGRAMA:
Healthcare:
${Object.values(data.programs.health).map(prog => `
**${prog.name}**
Schedule: **${prog.schedule}**
Location: **${prog.location}**`).join('\n')}

Social Services:
${Object.values(data.programs.social).map(prog => `
**${prog.name}**
${prog.benefits ? `Benefits:\n${prog.benefits.map(b => `- **${b}**`).join('\n')}` : ''}
${prog.activities ? `Activities:\n${prog.activities.map(a => `- **${a}**`).join('\n')}` : ''}`).join('\n')}

CONTACT INFORMATION:
Telephone: **${data.contactInfo.telephone}**
Mobile: **${data.contactInfo.mobile}**
Emergency: **${data.contactInfo.emergencyHotline}**
Email: **${data.contactInfo.email}**

GUIDELINES:
Garbage Collection:
${Object.entries(data.guidelines.garbageCollection.schedule).map(([day, zones]) => 
  `**${day}**: ${zones.join(', ')}`
).join('\n')}

Curfew Hours: **${data.guidelines.curfewHours.start}** to **${data.guidelines.curfewHours.end}**
`;
};

export const getDocumentInfo = (documentName) => {
  const documents = barangayData.documents;
  return Object.values(documents).find(
    doc => doc.name.toLowerCase().includes(documentName.toLowerCase())
  );
};

export const getServiceInfo = (serviceName) => {
  const services = barangayData.services;
  return Object.values(services).find(
    service => service.name.toLowerCase().includes(serviceName.toLowerCase())
  );
};

export const searchFAQ = (query) => {
  return barangayData.faqs.filter(faq => 
    faq.question.toLowerCase().includes(query.toLowerCase()) ||
    faq.answer.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCurrentAnnouncements = () => {
  return barangayData.announcements.current;
};

export const getUpcomingEvents = () => {
  return barangayData.announcements.upcoming;
};
