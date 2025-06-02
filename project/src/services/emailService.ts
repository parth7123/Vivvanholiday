import emailjs from 'emailjs-com';
import { FormData } from '../types';

const SERVICE_ID = import.meta.env.VITE_APP_EMAILJS_SERVICE_ID;
const ADMIN_TEMPLATE_ID = import.meta.env.VITE_APP_EMAILJS_ADMIN_TEMPLATE_ID;
// const USER_TEMPLATE_ID = 'template_3acmd1q';
const CONTACT_TEMPLATE_ID = import.meta.env.VITE_APP_EMAILJS_CONTACT_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const sendContactFormEmailToAdmin = async (formData: ContactFormData) => {
  if (!SERVICE_ID || !CONTACT_TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS configuration is missing');
  }

  const templateParams = {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    subject: formData.subject,
    message: formData.message,
    time: new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    }),
  };

  await emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams, PUBLIC_KEY);
};

export const sendEmailToAdmin = async (formData: FormData) => {
  if (!SERVICE_ID || !ADMIN_TEMPLATE_ID || !PUBLIC_KEY) {
    throw new Error('EmailJS configuration is missing');
  }

  const templateParams = {
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    title: formData.tourTitle,
    num_adults: formData.numAdults,
    children_1_5: formData.numChildren1to5,
    children_6_13: formData.numChildren6to13,
    total_travelers: parseInt(formData.numAdults) + parseInt(formData.numChildren1to5) + parseInt(formData.numChildren6to13),
    time: new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short'
    })
  };

  await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams, PUBLIC_KEY);
};

// export const sendEmailToAdmin = async (formData: FormData) => {
//   const templateParams = {
//     name: formData.name,
//     email: formData.email,
//     title: formData.tourTitle,
//     message: `
//       Tour Package: ${formData.tourTitle}
//       ----------------------
//       Personal Information:
//       ----------------------
//       Name: ${formData.name}
//       Age: ${formData.age}
//       Number of Children: ${formData.numChildren}
//       ----------------------
//       Contact Details:
//       ----------------------
//       Email: ${formData.email}
//       Phone: ${formData.phone}
//     `,
//     time: new Date().toLocaleString('en-IN', {
//       dateStyle: 'full',
//       timeStyle: 'short'
//     }),
//   };

//   await emailjs.send(SERVICE_ID, ADMIN_TEMPLATE_ID, templateParams, PUBLIC_KEY);
// };


