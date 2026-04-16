import { useState, useEffect } from "react";       // line 1
import "./QuoteFlow.css";               // line 2
import emailjs from "@emailjs/browser"; // line 3

const phone = "917718898455";
const openWhatsApp = (msg) =>
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);

const propertyTypes = [
  { id: "flat",       label: "Flat / Apartment", icon: "🏢" },
  { id: "house",      label: "House",             icon: "🏠" },
  { id: "bungalow",   label: "Bungalow",          icon: "🏡" },
  { id: "commercial", label: "Commercial",        icon: "🏗️" },
  { id: "other",      label: "Other",             icon: "📍" },
];

const pestOptions = [
  { id: "cockroach",  label: "Cockroaches",            icon: "🪳", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "ants",       label: "Ants",                   icon: "🐜", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "silverfish", label: "Silver Fish",             icon: "🐟", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "moths",      label: "Moths",                  icon: "🦋", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "spider",     label: "Spider",                 icon: "🕷️", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "crawling",   label: "Small Crawling Insects",  icon: "🐛", group: "crawling", properties: ["flat","house","bungalow"] },
  { id: "bedbugs",    label: "Bed Bugs",               icon: "🛏️", group: "bedbugs",  properties: ["flat","house","bungalow"] },
  { id: "termite",    label: "Termite",                icon: "🪵", group: "termite",  properties: ["flat","house","bungalow"] },
  { id: "mosquito",   label: "Mosquitoes",             icon: "🦟", group: "other",    properties: ["commercial"] },
  { id: "rodent",     label: "Rodents",                icon: "🐀", group: "other",    properties: ["commercial"] },
  { id: "other",      label: "Other",                  icon: "❓", group: "other",    properties: ["flat","house","bungalow"] },
];

const flatSizes     = ["Only Kitchen & Bathrooms","1 RK","1 BHK","2 BHK","3 BHK","4 BHK","5 BHK","6 BHK","Other"];
const houseSizes    = ["Only Kitchen & Bathrooms","Below 100 Sqft","100–200 Sqft","200–300 Sqft","300–400 Sqft","400–500 Sqft","500–750 Sqft","Other"];
const bungalowSizes = ["Only Kitchen & Bathrooms","750–1000 Sqft","1000–2000 Sqft","2000–3000 Sqft","3000–4000 Sqft","4000–5000 Sqft","5000–6000 Sqft","Other"];

const pricingData = {
  flat: {
    crawling: {
      "Only Kitchen & Bathrooms": { "Single Service – 30 Days": 899,  "Single Service – 90 Days": 1099, "AMC – 3 Services (Annual)": 1699, "AMC – 4 Services (Annual)": 1899 },
      "1 RK":  { "Single Service – 30 Days": 999,  "Single Service – 90 Days": 1199, "AMC – 3 Services (Annual)": 1899, "AMC – 4 Services (Annual)": 2199 },
      "1 BHK": { "Single Service – 30 Days": 1059, "Single Service – 90 Days": 1299, "AMC – 3 Services (Annual)": 2199, "AMC – 4 Services (Annual)": 2499 },
      "2 BHK": { "Single Service – 30 Days": 1159, "Single Service – 90 Days": 1399, "AMC – 3 Services (Annual)": 2499, "AMC – 4 Services (Annual)": 2699 },
      "3 BHK": { "Single Service – 30 Days": 1199, "Single Service – 90 Days": 1499, "AMC – 3 Services (Annual)": 2899, "AMC – 4 Services (Annual)": 3499 },
      "4 BHK": { "Single Service – 30 Days": 1299, "Single Service – 90 Days": 1699, "AMC – 3 Services (Annual)": 3599, "AMC – 4 Services (Annual)": 4199 },
      "5 BHK": { "Single Service – 30 Days": 1499, "Single Service – 90 Days": 1899, "AMC – 3 Services (Annual)": 4699, "AMC – 4 Services (Annual)": 5299 },
      "6 BHK": { "Single Service – 30 Days": 1699, "Single Service – 90 Days": 2499, "AMC – 3 Services (Annual)": 5499, "AMC – 4 Services (Annual)": 6399 },
    },
    bedbugs: {
      "Only Kitchen & Bathrooms": { "45 Days – 2 Services": "NA", "90 Days – 3 Services": "NA", "180 Days – 4 Services": "NA", "AMC – 8 Services (Annual)": "NA" },
      "1 RK":  { "45 Days – 2 Services": 2199, "90 Days – 3 Services": 3299, "180 Days – 4 Services": 4599, "AMC – 8 Services (Annual)": 5299 },
      "1 BHK": { "45 Days – 2 Services": 2599, "90 Days – 3 Services": 3699, "180 Days – 4 Services": 5199, "AMC – 8 Services (Annual)": 6899 },
      "2 BHK": { "45 Days – 2 Services": 3499, "90 Days – 3 Services": 4199, "180 Days – 4 Services": 5899, "AMC – 8 Services (Annual)": 7899 },
      "3 BHK": { "45 Days – 2 Services": 4699, "90 Days – 3 Services": 6499, "180 Days – 4 Services": 7799, "AMC – 8 Services (Annual)": 9299 },
      "4 BHK": { "45 Days – 2 Services": 5499, "90 Days – 3 Services": 7499, "180 Days – 4 Services": 9299, "AMC – 8 Services (Annual)": 11199 },
      "5 BHK": { "45 Days – 2 Services": 7199, "90 Days – 3 Services": 9199, "180 Days – 4 Services": 11159, "AMC – 8 Services (Annual)": 13459 },
      "6 BHK": { "45 Days – 2 Services": 8799, "90 Days – 3 Services": 10199, "180 Days – 4 Services": 13459, "AMC – 8 Services (Annual)": 16559 },
    },
    termite: {
      "Only Kitchen & Bathrooms": { "1 Year – 3 Services": "NA", "2 Years – 6 Services": "NA", "3 Years – 9 Services": "NA" },
      "1 RK":  { "1 Year – 3 Services": 2199, "2 Years – 6 Services": 4099,  "3 Years – 9 Services": 6299  },
      "1 BHK": { "1 Year – 3 Services": 2699, "2 Years – 6 Services": 5499,  "3 Years – 9 Services": 7199  },
      "2 BHK": { "1 Year – 3 Services": 3499, "2 Years – 6 Services": 6199,  "3 Years – 9 Services": 10199 },
      "3 BHK": { "1 Year – 3 Services": 4599, "2 Years – 6 Services": 7499,  "3 Years – 9 Services": 13199 },
      "4 BHK": { "1 Year – 3 Services": 6299, "2 Years – 6 Services": 10199, "3 Years – 9 Services": 17999 },
      "5 BHK": { "1 Year – 3 Services": 8199, "2 Years – 6 Services": 14299, "3 Years – 9 Services": 22999 },
      "6 BHK": { "1 Year – 3 Services": 10199,"2 Years – 6 Services": 18999, "3 Years – 9 Services": 29459 },
    },
  },
  bungalow: {
    crawling: {
      "Only Kitchen & Bathrooms": { "Single Service – 30 Days": 1099, "Single Service – 90 Days": 1499, "AMC – 3 Services (Annual)": 2499, "AMC – 4 Services (Annual)": 2899 },
      "750–1000 Sqft":  { "Single Service – 30 Days": 1399, "Single Service – 90 Days": 1679, "AMC – 3 Services (Annual)": 2659, "AMC – 4 Services (Annual)": 3079 },
      "1000–2000 Sqft": { "Single Service – 30 Days": 1483, "Single Service – 90 Days": 1819, "AMC – 3 Services (Annual)": 3079, "AMC – 4 Services (Annual)": 3499 },
      "2000–3000 Sqft": { "Single Service – 30 Days": 1623, "Single Service – 90 Days": 1959, "AMC – 3 Services (Annual)": 3499, "AMC – 4 Services (Annual)": 3779 },
      "3000–4000 Sqft": { "Single Service – 30 Days": 1679, "Single Service – 90 Days": 2099, "AMC – 3 Services (Annual)": 4059, "AMC – 4 Services (Annual)": 4899 },
      "4000–5000 Sqft": { "Single Service – 30 Days": 1819, "Single Service – 90 Days": 2379, "AMC – 3 Services (Annual)": 5039, "AMC – 4 Services (Annual)": 5879 },
      "5000–6000 Sqft": { "Single Service – 30 Days": 2099, "Single Service – 90 Days": 2659, "AMC – 3 Services (Annual)": 6579, "AMC – 4 Services (Annual)": 7419 },
    },
    bedbugs: {
      "Only Kitchen & Bathrooms": { "45 Days – 2 Services": "NA", "90 Days – 3 Services": "NA", "180 Days – 4 Services": "NA", "AMC – 8 Services (Annual)": "NA" },
      "750–1000 Sqft":  { "45 Days – 2 Services": 3079,  "90 Days – 3 Services": 4619,  "180 Days – 4 Services": 6439,  "AMC – 8 Services (Annual)": 7419  },
      "1000–2000 Sqft": { "45 Days – 2 Services": 3639,  "90 Days – 3 Services": 5179,  "180 Days – 4 Services": 7279,  "AMC – 8 Services (Annual)": 9659  },
      "2000–3000 Sqft": { "45 Days – 2 Services": 4899,  "90 Days – 3 Services": 5879,  "180 Days – 4 Services": 8259,  "AMC – 8 Services (Annual)": 11059 },
      "3000–4000 Sqft": { "45 Days – 2 Services": 6579,  "90 Days – 3 Services": 9099,  "180 Days – 4 Services": 10919, "AMC – 8 Services (Annual)": 13019 },
      "4000–5000 Sqft": { "45 Days – 2 Services": 7699,  "90 Days – 3 Services": 10499, "180 Days – 4 Services": 13019, "AMC – 8 Services (Annual)": 15679 },
      "5000–6000 Sqft": { "45 Days – 2 Services": 10079, "90 Days – 3 Services": 12879, "180 Days – 4 Services": 15623, "AMC – 8 Services (Annual)": 18843 },
    },
    termite: {
      "Only Kitchen & Bathrooms": { "1 Year – 3 Services": "NA", "2 Years – 6 Services": "NA", "3 Years – 9 Services": "NA" },
      "750–1000 Sqft":  { "1 Year – 3 Services": 3079,  "2 Years – 6 Services": 5739,  "3 Years – 9 Services": 8819  },
      "1000–2000 Sqft": { "1 Year – 3 Services": 3779,  "2 Years – 6 Services": 7699,  "3 Years – 9 Services": 10079 },
      "2000–3000 Sqft": { "1 Year – 3 Services": 4899,  "2 Years – 6 Services": 8679,  "3 Years – 9 Services": 14279 },
      "3000–4000 Sqft": { "1 Year – 3 Services": 6439,  "2 Years – 6 Services": 10499, "3 Years – 9 Services": 18479 },
      "4000–5000 Sqft": { "1 Year – 3 Services": 8819,  "2 Years – 6 Services": 14279, "3 Years – 9 Services": 25199 },
      "5000–6000 Sqft": { "1 Year – 3 Services": 11479, "2 Years – 6 Services": 20019, "3 Years – 9 Services": 32199 },
    },
  },
  house: {
    crawling: {
      "Only Kitchen & Bathrooms": { "Single Service – 30 Days": 899,  "Single Service – 90 Days": 1099, "AMC – 3 Services (Annual)": 1699, "AMC – 4 Services (Annual)": 1899 },
      "Below 100 Sqft": { "Single Service – 30 Days": 999,  "Single Service – 90 Days": 1199, "AMC – 3 Services (Annual)": 1899, "AMC – 4 Services (Annual)": 2199 },
      "100–200 Sqft":   { "Single Service – 30 Days": 1059, "Single Service – 90 Days": 1299, "AMC – 3 Services (Annual)": 2199, "AMC – 4 Services (Annual)": 2499 },
      "200–300 Sqft":   { "Single Service – 30 Days": 1159, "Single Service – 90 Days": 1399, "AMC – 3 Services (Annual)": 2499, "AMC – 4 Services (Annual)": 2699 },
      "300–400 Sqft":   { "Single Service – 30 Days": 1199, "Single Service – 90 Days": 1499, "AMC – 3 Services (Annual)": 2899, "AMC – 4 Services (Annual)": 3499 },
      "400–500 Sqft":   { "Single Service – 30 Days": 1299, "Single Service – 90 Days": 1699, "AMC – 3 Services (Annual)": 3599, "AMC – 4 Services (Annual)": 4199 },
      "500–750 Sqft":   { "Single Service – 30 Days": 1499, "Single Service – 90 Days": 1899, "AMC – 3 Services (Annual)": 4699, "AMC – 4 Services (Annual)": 5299 },
    },
    bedbugs: {
      "Only Kitchen & Bathrooms": { "45 Days – 2 Services": "NA", "90 Days – 3 Services": "NA", "180 Days – 4 Services": "NA", "AMC – 8 Services (Annual)": "NA" },
      "Below 100 Sqft": { "45 Days – 2 Services": 2199, "90 Days – 3 Services": 3299, "180 Days – 4 Services": 4599, "AMC – 8 Services (Annual)": 5299 },
      "100–200 Sqft":   { "45 Days – 2 Services": 2599, "90 Days – 3 Services": 3699, "180 Days – 4 Services": 5199, "AMC – 8 Services (Annual)": 6899 },
      "200–300 Sqft":   { "45 Days – 2 Services": 3499, "90 Days – 3 Services": 4199, "180 Days – 4 Services": 5899, "AMC – 8 Services (Annual)": 7899 },
      "300–400 Sqft":   { "45 Days – 2 Services": 4699, "90 Days – 3 Services": 6499, "180 Days – 4 Services": 7799, "AMC – 8 Services (Annual)": 9299 },
      "400–500 Sqft":   { "45 Days – 2 Services": 5499, "90 Days – 3 Services": 7499, "180 Days – 4 Services": 9299, "AMC – 8 Services (Annual)": 11199 },
      "500–750 Sqft":   { "45 Days – 2 Services": 7199, "90 Days – 3 Services": 9199, "180 Days – 4 Services": 11159,"AMC – 8 Services (Annual)": 13459 },
    },
    termite: {
      "Only Kitchen & Bathrooms": { "1 Year – 3 Services": "NA", "2 Years – 6 Services": "NA", "3 Years – 9 Services": "NA" },
      "Below 100 Sqft": { "1 Year – 3 Services": 2199, "2 Years – 6 Services": 4099,  "3 Years – 9 Services": 6299  },
      "100–200 Sqft":   { "1 Year – 3 Services": 2699, "2 Years – 6 Services": 5499,  "3 Years – 9 Services": 7199  },
      "200–300 Sqft":   { "1 Year – 3 Services": 3499, "2 Years – 6 Services": 6199,  "3 Years – 9 Services": 10199 },
      "300–400 Sqft":   { "1 Year – 3 Services": 4599, "2 Years – 6 Services": 7499,  "3 Years – 9 Services": 13199 },
      "400–500 Sqft":   { "1 Year – 3 Services": 6299, "2 Years – 6 Services": 10199, "3 Years – 9 Services": 17999 },
      "500–750 Sqft":   { "1 Year – 3 Services": 8199, "2 Years – 6 Services": 14299, "3 Years – 9 Services": 22999 },
    },
  },
};

const serviceDescriptions = {
  crawling: {
    warranty: {
      "Single Service – 30 Days": "30 Days",
      "Single Service – 90 Days": "90 Days",
      "AMC – 3 Services (Annual)": "365 Days",
      "AMC – 4 Services (Annual)": "365 Days",
    },
    treatmentMethod: "Chemical Spray & Gel Treatment",
    description: "Two-step pest control treatment for cockroaches, ants, and common pests. Step 1: Chemical spray in kitchen & washroom. Step 2: Gel treatment after 7 days in kitchen to target hidden pests and prevent re-infestation.",
    pestsCovered: ["Cockroach","Ant","Spider","Moths","SilverFish","Booklice/Psocids","Springtail","Earwigs","Centipedes","Millipede"],
    pestsNotCovered: ["Termite","Wood Borer","Bed Bugs","Fleas","Flies","Lizards","Blanket Worms","Mosquitoes","Flying Insects","Honey Bees","Beetles","Carpenter Ant","White Ant","Rat","Mice","Bandicoots","Ticks","Pigeons","Squirrels","Wasps/Hornets","Plant Feeding Insects","Bees"],
    chemicals: "Odour or Odourless as per customer request. In case of high pest infestation, Odour Chemical is recommended for quick response. All chemicals are Government & CIB (Chemical Insecticide Board of India) approved.",
    notes: [
      "Inform our team in advance if there are any pets, kids, senior citizens, or asthmatic patients at home.",
      "If pest infestation is high, the kitchen must be kept empty by removing all items from upper and lower cabinets.",
      "Keep food, utensils, and personal belongings covered before service.",
      "Avoid mopping treated areas for at least 2–3 hours after pest control.",
      "Keep windows open for 15–20 minutes after treatment for ventilation.",
      "Pets and sensitive individuals should stay away from the treated area for 2–3 hours.",
      "Follow all expert instructions carefully during service.",
      "If the customer instructs the technician to perform treatment against company protocol, the company will not be responsible for any unsatisfactory results.",
    ],
    customerToProvide: "Please ensure water supply is available during the service.",
    paymentTerms: "100% payment to be made immediately after the completion of the first service. For AMC or multiple-visit contracts, subsequent services will be scheduled only after the payment for the first service has been received. Payment can be made via Cash, UPI, Bank Transfer.",
    termsAndConditions: [
      "Service Confirmation: Services will be provided only after confirmation via call, message, or written communication.",
      "Scope of Work: Treatment will be carried out for the pests mentioned in the quotation. Any additional pest treatment will be charged separately.",
      "Customer Responsibility: The customer must ensure that all food items, utensils, and pet belongings are safely covered or removed before treatment.",
      "Chemical Safety: All chemicals are approved by the Central Insecticide Board (CIB). Do not wipe treated surfaces for at least 2–3 hours post-service.",
      "Access to Premises: Customer must ensure access to all areas. Locked areas will not be treated and will not be eligible for rework.",
      "Guarantee & Warranty: Valid only for the specified period and limited to the same pest issue.",
      "Revisit & Complaint Handling: Complaints must be reported within 7 days of service for free follow-up.",
      "Safety: Customers, children, pets, and elderly should stay away from treated areas for up to 2 hours after treatment.",
      "AMC Services: Customer must schedule each service within the contract period. Missed services will be considered lapsed.",
      "Payment Terms: 100% payment due immediately after first service. AMC continuation subject to full payment.",
      "Liability: Company liability is limited to the value of the service booked.",
      "GST & Billing: GST charged as applicable. Invoice issued in the name of NEW TECH SERVICE only.",
      "Jurisdiction: All disputes subject to Mumbai jurisdiction only.",
    ],
  },
  bedbugs: {
    warranty: {
      "45 Days – 2 Services":      "45 Days",
      "90 Days – 3 Services":      "90 Days",
      "180 Days – 4 Services":     "180 Days",
      "AMC – 8 Services (Annual)": "365 Days",
    },
    treatmentMethod: "Chemical Spray",
    areaOfService: "Hall and Bedrooms",
    description: "Our Bed Bugs Control service includes 2 visits for complete elimination of Bed Bugs from your home. The first treatment targets active infestation areas using a chemical spray, and the second follow-up treatment is done after 10 days to ensure all hidden eggs and larvae are removed. The spray is applied to all infested areas such as beds, sofas, chairs, tables, doors, wardrobes, pillows, cabinets, switchboards, and wiring points. For best results, do not spray directly on clothes. Instead, soak all clothes in hot water mixed with our recommended chemical — the combination of heat and treatment kills Bed Bugs effectively.",
    pestsCovered: ["Bed Bugs"],
    pestsNotCovered: ["Cockroach","Ant","Spider","Moths","Small Crawling Insects","Termite","Wood Borer","Fleas","Flies","Lizards","Blanket Worms","Mosquitoes","Flying Insects","Honey Bees","Beetles","Carpenter Ant","White Ant","Rat","Mice","Bandicoots","Ticks","Pigeons","Squirrels","Wasps/Hornets","Bees"],
    chemicals: "Odour or Odourless as per customer request. In case of high pest infestation, Odour Chemical is recommended for quick response. All chemicals are Government & CIB (Chemical Insecticide Board of India) approved.",
    notes: [
      "Inform our team in advance if there are any pets, kids, senior citizens, or asthmatic patients at home.",
      "Follow all expert instructions carefully during and after the service.",
      "Avoid mopping or cleaning treated surfaces for at least 2–3 hours.",
      "Keep rooms ventilated after treatment for 15–20 minutes.",
      "Pets and sensitive individuals should stay away from the treated area for 2–3 hours.",
      "If the customer instructs the technician to perform treatment against company protocol, the company will not be responsible for any unsatisfactory results.",
    ],
    customerToProvide: "Please ensure water supply is available during the service.",
    paymentTerms: "100% payment to be made immediately after the completion of the first service. For AMC or multiple-visit contracts, subsequent services will be scheduled only after the payment for the first service has been received. Payment can be made via Cash, UPI, Bank Transfer, or Cheque in favor of NEW TECH SERVICE. GST will be applicable extra as per government norms (if billed).",
    termsAndConditions: [
      "Service Confirmation: Services will be provided only after confirmation via call, message, or written communication. Scheduling is subject to technician availability.",
      "Scope of Work: Treatment will be carried out for the pests mentioned in the quotation. Any additional pest treatment will be charged separately.",
      "Customer Responsibility: The customer must ensure that all food items, utensils, and pet belongings are safely covered or removed before treatment. The company will not be responsible for any contamination or damage due to chemical exposure.",
      "Chemical Safety: All chemicals used are approved by the CIB and are safe when used as directed. Do not wipe treated surfaces for at least 2–3 hours post-service.",
      "Access to Premises: The customer must ensure access to all areas of treatment. Locked or inaccessible areas will not be treated and will not be eligible for rework.",
      "Guarantee & Warranty: Valid only for the specified period and limited to the same pest issue. Re-service will not be provided for poor housekeeping or pest entry from external sources.",
      "Revisit & Complaint Handling: Any complaint or recurrence should be reported within 7 days of the service for free follow-up (if under warranty).",
      "Safety & Instructions: Customers, children, pets, and elderly persons are advised to stay away from the treated area during and up to 2 hours after treatment.",
      "AMC Services: For AMC contracts, the customer must schedule each service within the contract period. Missed services will be considered lapsed.",
      "Payment Terms: 100% payment is due immediately after completion of the first service. AMC continuation subject to full payment.",
      "Liability: The company's liability is limited to the value of the service booked.",
      "GST & Billing: GST will be charged extra as applicable. Invoice will be issued in the name of NEW TECH SERVICE only.",
      "Jurisdiction: All disputes are subject to Mumbai jurisdiction only.",
    ],
  },
  termite: {
    warranty: {
      "1 Year – 3 Services":  "1 Year",
      "2 Years – 6 Services": "2 Years",
      "3 Years – 9 Services": "3 Years",
    },
    treatmentMethod: "Drill, Chemical Inject & Spot Treatment",
    areaOfService: "Junction of wall & floor and wall-attached wooden furniture",
    description: "1st Service: Drilling will be done at the wall and floor junction at every 1-foot distance. Each drill point will be injected 3 times with anti-termite chemical and then sealed with white cement. Treatment will be done along common building walls passing through rooms. 2nd & 3rd Service: Inspection visits to check for termite activity. If any presence is observed, spot treatment will be performed. Wooden Furniture Protection: Oil-based chemical will be sprayed along the borders and inside small drill points at 1–2 feet distance on furniture attached to walls, then sealed with white cement. This protects furniture from termite attacks coming from upper or adjoining flats.",
    pestsCovered: ["Termite"],
    pestsNotCovered: ["Bed Bugs","Cockroach","Ant","Spider","Moths","Small Crawling Insects","Wood Borer","Fleas","Flies","Lizards","Blanket Worms","Mosquitoes","Flying Insects","Honey Bees","Beetles","Carpenter Ant","White Ant","Rat","Mice","Bandicoots","Ticks","Pigeons","Squirrels","Wasps/Hornets","Bees"],
    chemicals: "Odour or Odourless as per customer request. In case of high pest infestation, Odour Chemical is recommended for quick response. All chemicals are Government & CIB (Chemical Insecticide Board of India) approved.",
    notes: [
      "Inform our team if there are pets, kids, senior citizens, or asthmatic patients at home.",
      "Customers must follow the expert's instructions during and after treatment.",
      "If any furniture is attached to the wall, please inform us at the time of service booking.",
      "Avoid giving personal instructions to the technician. The company will not be responsible if the service is altered or performed differently as per customer's direction.",
    ],
    customerToProvide: "Client has to provide water supply and electric connection during the service. At the time of service booking, please provide details of wall-attached wooden furniture such as number and type of beds, wardrobes, and wall cabinets. This information is required for wooden furniture termite treatment.",
    paymentTerms: "100% payment to be made immediately after the completion of the first service. For AMC or multiple-visit contracts, subsequent services will be scheduled only after the payment for the first service has been received. Payment can be made via Cash, UPI, Bank Transfer, or Cheque in favor of NEW TECH SERVICE. GST will be applicable extra as per government norms (if billed).",
    termsAndConditions: [
      "Service Confirmation: Services will be provided only after confirmation via call, message, or written communication. Scheduling is subject to technician availability.",
      "Scope of Work: Treatment will be carried out for the pests mentioned in the quotation. Any additional pest treatment will be charged separately.",
      "Customer Responsibility: The customer must ensure that all food items, utensils, and pet belongings are safely covered or removed before treatment.",
      "Chemical Safety: All chemicals used are approved by the CIB and are safe when used as directed. Do not wipe treated surfaces for at least 2–3 hours post-service.",
      "Access to Premises: The customer must ensure access to all areas of treatment. Locked or inaccessible areas will not be treated and will not be eligible for rework.",
      "Guarantee & Warranty: Valid only for the specified period and limited to the same pest issue. Re-service will not be provided for poor housekeeping or pest entry from external sources.",
      "Revisit & Complaint Handling: Any complaint or recurrence should be reported within 7 days of the service for free follow-up (if under warranty).",
      "Safety & Instructions: Customers, children, pets, and elderly persons are advised to stay away from the treated area during and up to 2 hours after treatment.",
      "AMC Services: For AMC contracts, the customer must schedule each service within the contract period. Missed services will be considered lapsed.",
      "Payment Terms: 100% payment is due immediately after completion of the first service. AMC continuation subject to full payment.",
      "Liability: The company's liability is limited to the value of the service booked.",
      "GST & Billing: GST will be charged extra as applicable. Invoice will be issued in the name of NEW TECH SERVICE only.",
      "Jurisdiction: All disputes are subject to Mumbai jurisdiction only.",
    ],
   },
};

const allPlans = [
  {
    id: "crawling", group: "crawling",
    title: "Cockroaches, Ants, Spider, Moths, Silverfish & Crawling Insects",
    options: ["Single Service – 30 Days","Single Service – 90 Days","AMC – 3 Services (Annual)","AMC – 4 Services (Annual)"],
  },
  {
    id: "bedbugs", group: "bedbugs",
    title: "Bed Bugs Warranty",
    options: ["45 Days – 2 Services","90 Days – 3 Services","180 Days – 4 Services","AMC – 8 Services (Annual)"],
  },
  {
    id: "termite", group: "termite",
    title: "Anti Termite Warranty",
    options: ["1 Year – 3 Services","2 Years – 6 Services","3 Years – 9 Services"],
  },
];


const offers = [
  { id: "new",    label: "🎉 New Customer",    discount: 10 },
  { id: "repeat", label: "🔁 Repeat Customer", discount: 15 },
  { id: "combo",  label: "🤝 Combo Deal",       discount: 15 },
];

const fmt           = (n)         => `₹${Math.round(n).toLocaleString("en-IN")}`;
const applyDiscount = (price, pct) => price - (price * pct / 100);

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvAouj8t_PC7QFDnvEs5P0SipDJasaLEMkCRl9rkZGdVhTakpB8eg01zKTBRSgeQcW/exec";

/* ══ AVAILABLE SLOTS COMPONENT ══════════════════════════ */
function AvailableSlots({ date, area, bookingSlot, setBookingSlot }) {
  const [loading, setLoading]     = useState(true);
  const [available, setAvailable] = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    if (!date) return;

    // No area selected — show all slots
    if (!area) {
      setAvailable({
        morning:       ["8:00 AM – 8:30 AM","10:00 AM – 10:30 AM","12:00 PM – 12:30 PM","2:00 PM – 2:30 PM"],
        afternoon:     ["3:00 PM – 3:30 PM","4:00 PM – 4:30 PM","6:00 PM – 6:30 PM","8:00 PM – 8:30 PM"],
        techMorning:   "To Be Assigned",
        techAfternoon: "To Be Assigned",
        morningFull:   false,
        afternoonFull: false,
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(
      `${SCRIPT_URL}?action=getAvailability&date=${date}&area=${encodeURIComponent(area)}`,
      { redirect: "follow" }
    )
      .then(r => r.text())
      .then(text => {
        try {
          const data = JSON.parse(text);
          if (data.status === "success") {
            if (data.message === "whatsapp_only") {
              setError("whatsapp_only");
            } else {
              setAvailable(data.available);
            }
          } else {
            setError("error");
          }
        } catch {
          setError("error");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("error");
        setLoading(false);
      });
  }, [date, area]);

  if (loading) return (
    <div className="qf-slots-loading">
      <div className="qf-spinner">⏳</div>
      <p>Checking available slots...</p>
    </div>
  );

  if (error === "whatsapp_only") return (
    <div className="qf-other-box">
      <div className="qf-other-title">📍 {area} — Call to Book</div>
      <p className="qf-other-sub">
        Online booking not available for this area yet. Please contact us directly.
      </p>
      <div className="qf-other-options">
        <div className="qf-other-card"
          onClick={() => window.open(`https://wa.me/917718898455?text=Hi, I want to book service in ${area}`)}>
          <span className="qf-other-icon">💬</span>
          <span className="qf-other-label">WhatsApp Us</span>
          <span className="qf-other-desc">Book via WhatsApp</span>
        </div>
        <div className="qf-other-card"
          onClick={() => window.open("tel:+917718898455")}>
          <span className="qf-other-icon">📞</span>
          <span className="qf-other-label">Call Us</span>
          <span className="qf-other-desc">+91 77188 98455</span>
        </div>
      </div>
    </div>
  );

  const fallbackSlots = [
    { session:"🌅 Morning",           slots:["8:00 AM – 8:30 AM","10:00 AM – 10:30 AM","12:00 PM – 12:30 PM","2:00 PM – 2:30 PM"] },
    { session:"🌆 Afternoon/Evening", slots:["3:00 PM – 3:30 PM","4:00 PM – 4:30 PM","6:00 PM – 6:30 PM","8:00 PM – 8:30 PM"] },
  ];

  if (error) return (
    <div className="qf-slots-section">
      <p className="qf-slots-title">⏰ Select Time Slot</p>
      <p style={{color:"#888",fontSize:"13px",marginBottom:"12px"}}>
        Showing all slots — availability will be confirmed by our team.
      </p>
      {fallbackSlots.map(({ session, slots }) => (
        <div key={session} className="qf-slot-group">
          <div className="qf-slot-session">{session}</div>
          <div className="qf-slot-grid">
            {slots.map(slot => (
              <div key={slot}
                className={`qf-slot ${bookingSlot === slot ? "qf-slot-selected" : ""}`}
                onClick={() => setBookingSlot(slot)}>
                {slot}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  /* ── FILTER PAST SLOTS IF TODAY ── */
const filterPastSlots = (slots) => {
  const today = new Date().toISOString().split("T")[0];
  if (date !== today) return slots;

  const now = new Date();
  const currentHour   = now.getHours();
  const currentMinute = now.getMinutes();

  return slots.filter(slot => {
    const timeStr = slot.split(" – ")[0]; // "8:00 AM"
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let slotHour = hours;
    if (period === "PM" && hours !== 12) slotHour += 12;
    if (period === "AM" && hours === 12) slotHour = 0;

    // Add 1 hour buffer — need at least 1 hour notice
    const bufferHour = currentHour + 1;
    const bufferMin  = currentMinute;

    if (slotHour > bufferHour) return true;
    if (slotHour === bufferHour && minutes > bufferMin) return true;
    return false;
  });
};

const filteredMorning   = filterPastSlots(available?.morning   || []);
const filteredAfternoon = filterPastSlots(available?.afternoon || []);
const hasSlots = filteredMorning.length > 0 || filteredAfternoon.length > 0;

  return (
    <div className="qf-slots-section">
      <p className="qf-slots-title">⏰ Select Time Slot</p>

      {!hasSlots && (
        <div className="qf-slots-full">
          <p>😔 All slots are fully booked for this date!</p>
          <p style={{marginTop:"6px",fontWeight:"400"}}>Please select a different date.</p>
        </div>
      )}

      {/* MORNING */}
      {filteredMorning.length > 0 && (
        <div className="qf-slot-group">
          <div className="qf-slot-session">
            🌅 Morning Shift
            <span className="qf-tech-badge">👷 {available.techMorning}</span>
          </div>
          <div className="qf-slot-grid">
            {filteredMorning.map(slot => (
              <div key={slot}
                className={`qf-slot ${bookingSlot === slot ? "qf-slot-selected" : ""}`}
                onClick={() => setBookingSlot(slot)}>
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}
      {(available?.morningFull || (filteredMorning.length === 0 && available?.morning?.length > 0)) && (
        <div className="qf-slot-group">
          <div className="qf-slot-session">🌅 Morning Shift</div>
          <div className="qf-slot-full">🔴 Morning slots not available</div>
        </div>
      )}
            {/* AFTERNOON */}
      {filteredAfternoon.length > 0 && (
        <div className="qf-slot-group">
          <div className="qf-slot-session">
            🌆 Afternoon/Evening Shift
            <span className="qf-tech-badge">👷 {available.techAfternoon}</span>
          </div>
          <div className="qf-slot-grid">
            {filteredAfternoon.map(slot => (
              <div key={slot}
                className={`qf-slot ${bookingSlot === slot ? "qf-slot-selected" : ""}`}
                onClick={() => setBookingSlot(slot)}>
                {slot}
              </div>
            ))}
          </div>
        </div>
      )}
      {(available?.afternoonFull || (filteredAfternoon.length === 0 && available?.afternoon?.length > 0)) && (
        <div className="qf-slot-group">
          <div className="qf-slot-session">🌆 Afternoon/Evening Shift</div>
          <div className="qf-slot-full">🔴 Afternoon slots not available</div>
        </div>
      )}
    </div>
  );
}

export default function QuoteFlow({ onClose, mode, selectedArea }) {
  const [step, setStep]                   = useState(1);
  const [property, setProperty]           = useState("");
  const [pests, setPests]                 = useState([]);
  const [size, setSize]                   = useState("");
  const [selectedPlans, setSelectedPlans] = useState({});
  const [showExit, setShowExit]           = useState(false);
  const [showDetails, setShowDetails]     = useState(false);
  const [detailsPlan, setDetailsPlan]     = useState(null);
  const [detailsOpt, setDetailsOpt]       = useState(null);
  const [action, setAction]               = useState("");
  const [selectedOffer, setSelectedOffer] = useState("new");
  const [bookingDate, setBookingDate]     = useState("");
  const [bookingSlot, setBookingSlot]     = useState("");
  const [form, setForm]                   = useState({ name: "", phone: "", email: "" });

  const totalSteps = action === "book" ? 7 : 6;

  const togglePest = (id) =>
    setPests((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const getRelevantPlans = () => {
    const groups = new Set();
    pests.forEach(pestId => {
      const pest = pestOptions.find(p => p.id === pestId);
      if (pest) groups.add(pest.group);
    });
    if (groups.has("other")) groups.add("crawling");
    return allPlans.filter(plan => groups.has(plan.group));
  };

  const togglePlan = (planId, option) =>
    setSelectedPlans((prev) => ({ ...prev, [planId]: option }));

  const getSizes = () => {
    if (property === "flat")     return flatSizes;
    if (property === "house")    return houseSizes;
    if (property === "bungalow") return bungalowSizes;
    return flatSizes;
  };

  const getPrice = (planGroup, opt) =>
    pricingData[property]?.[planGroup]?.[size]?.[opt];

  const getDiscountPct = () =>
    offers.find(o => o.id === selectedOffer)?.discount || 10;

  const getCartTotal = () => {
    let total = 0;
    Object.entries(selectedPlans).forEach(([planId, opt]) => {
      const plan  = allPlans.find(p => p.id === planId);
      const price = getPrice(plan?.group, opt);
      if (price && price !== "NA") total += price;
    });
    return total;
  };

  const cartTotal   = getCartTotal();
  const discountPct = getDiscountPct();
  const discountAmt = Math.round(cartTotal * discountPct / 100);
  const finalPrice  = Math.round(cartTotal - discountAmt);

  const handleClose = () => setShowExit(true);

  const handleSubmit = async () => {

  /* ── BUILD SERVICE DETAILS ── */
  const serviceDetails = Object.entries(selectedPlans).map(([planId, opt]) => {
    const plan    = allPlans.find(p => p.id === planId);
    const desc    = serviceDescriptions[plan?.group];
    const price   = getPrice(plan?.group, opt);
    const disc    = price && price !== "NA" ? Math.round(applyDiscount(price, discountPct)) : null;
    const warranty = desc?.warranty?.[opt] || "As per plan";
    return `
━━━━━━━━━━━━━━━━━━━━━━
📋 *${plan?.title}*
━━━━━━━━━━━━━━━━━━━━━━
✅ Plan: ${opt}
🛡️ Warranty: ${warranty}
🔬 Treatment: ${desc?.treatmentMethod}
📍 Service Area: ${desc?.areaOfService || "As applicable"}
💰 Price: ₹${price?.toLocaleString("en-IN")} → *₹${disc?.toLocaleString("en-IN")}*

✅ *Pests Covered:*
${desc?.pestsCovered?.join(", ")}

❌ *Pests NOT Covered:*
${desc?.pestsNotCovered?.join(", ")}

⚠️ *Special Instructions:*
${desc?.notes?.map((n, i) => `${i + 1}. ${n}`).join("\n")}

🏠 *Customer to Provide:*
${desc?.customerToProvide}

💳 *Payment Terms:*
${desc?.paymentTerms}
`;
  }).join("\n");

  /* ── TERMS & CONDITIONS ── */
  const tcList = (() => {
    const firstPlanId = Object.keys(selectedPlans)[0];
    const plan = allPlans.find(p => p.id === firstPlanId);
    return serviceDescriptions[plan?.group]?.termsAndConditions
      ?.map((t, i) => `${i + 1}. ${t}`).join("\n") || "";
  })();

  const offerLabel  = offers.find(o => o.id === selectedOffer)?.label;
 

  /* ── PLAN SUMMARY FOR EMAIL ── */
  const planSummary = Object.entries(selectedPlans).map(([k, v]) => {
    const plan  = allPlans.find(p => p.id === k);
    const price = getPrice(plan?.group, v);
    const disc  = price !== "NA" ? applyDiscount(price, discountPct) : price;
    return `${v} → ${fmt(disc)}`;
  }).join("\n");

  /* ── 1. WHATSAPP ── */
  const msg = action === "book"
    ? `🏠 *NEW SERVICE BOOKING*
New Tech Home Services
📞 +91 85917 22846
━━━━━━━━━━━━━━━━━━━━━━

👤 *Customer Details*
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}

🏠 *Property Details*
Type: ${property} — ${size}
Pests: ${pests.join(", ")}
Kitchen & Bathroom: No

📅 *Booking Details*
Date: ${bookingDate}
Time: ${bookingSlot}

${serviceDetails}

💰 *PRICE SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━
Original Price: ₹${cartTotal.toLocaleString("en-IN")}
${offerLabel} (${discountPct}% OFF): -₹${discountAmt.toLocaleString("en-IN")}
*✅ Final Price: ₹${finalPrice.toLocaleString("en-IN")} (GST Incl.)*

📜 *Terms & Conditions*
━━━━━━━━━━━━━━━━━━━━━━
${tcList}

_Our team will contact you within 30 minutes to confirm._`

    : `💰 *PEST CONTROL QUOTATION*
New Tech Home Services
📞 +91 85917 22846
━━━━━━━━━━━━━━━━━━━━━━

👤 *Customer Details*
Name: ${form.name}
Phone: ${form.phone}
Email: ${form.email}

🏠 *Property Details*
Type: ${property} — ${size}
Pests: ${pests.join(", ")}
Kitchen & Bathroom: No

${serviceDetails}

💰 *PRICE SUMMARY*
━━━━━━━━━━━━━━━━━━━━━━
Original Price: ₹${cartTotal.toLocaleString("en-IN")}
${offerLabel} (${discountPct}% OFF): -₹${discountAmt.toLocaleString("en-IN")}
*✅ Final Price: ₹${finalPrice.toLocaleString("en-IN")} (GST Incl.)*

📜 *Terms & Conditions*
━━━━━━━━━━━━━━━━━━━━━━
${tcList}

_This quotation is valid for 7 days from the date of issue._
_New Tech Home Services | Mumbai_`;

  openWhatsApp(msg);

  /* ── 2. EMAIL via EmailJS ── */
  try {
    await emailjs.send(
      "service_5jy1f0l",
      "template_al60i38",
      {
        name:  form.name,
        email: form.email,
        message: `
NEW TECH HOME SERVICES
${action === "book" ? "BOOKING CONFIRMATION" : "OFFICIAL QUOTATION"}
========================================

Customer: ${form.name}
Phone: ${form.phone}
Email: ${form.email}
Property: ${property} — ${size}
Pests: ${pests.join(", ")}
Kitchen & Bathroom: No
${action === "book" ? `Date: ${bookingDate}\nTime Slot: ${bookingSlot}` : ""}

----------------------------------------
SERVICE DETAILS
----------------------------------------
${Object.entries(selectedPlans).map(([planId, opt]) => {
  const plan  = allPlans.find(p => p.id === planId);
  const desc  = serviceDescriptions[plan?.group];
  const price = getPrice(plan?.group, opt);
  const disc  = price && price !== "NA" ? Math.round(applyDiscount(price, discountPct)) : null;
  return `
PLAN: ${plan?.title}
Option: ${opt}
Warranty: ${desc?.warranty?.[opt] || "As per plan"}
Treatment: ${desc?.treatmentMethod}
Service Area: ${desc?.areaOfService || "As applicable"}
Original Price: Rs.${price?.toLocaleString("en-IN")}
Final Price: Rs.${disc?.toLocaleString("en-IN")}

Pests Covered: ${desc?.pestsCovered?.join(", ")}

Pests NOT Covered: ${desc?.pestsNotCovered?.join(", ")}

Special Instructions:
${desc?.notes?.map((n, i) => `${i+1}. ${n}`).join("\n")}

Customer to Provide: ${desc?.customerToProvide}

Payment Terms: ${desc?.paymentTerms}
`;
}).join("\n----------------------------------------\n")}

----------------------------------------
PRICE SUMMARY
----------------------------------------
Original Price: Rs.${cartTotal.toLocaleString("en-IN")}
Offer: ${offerLabel} (${discountPct}% OFF)
Discount: -Rs.${discountAmt.toLocaleString("en-IN")}
FINAL PRICE: Rs.${finalPrice.toLocaleString("en-IN")} (GST Included)

----------------------------------------
TERMS & CONDITIONS
----------------------------------------
${tcList}

========================================
New Tech Home Services
+91 85917 22846 | newtechpest01@gmail.com
${action === "quote" ? "This quotation is valid for 7 days." : "Our team will contact you within 30 minutes."}
========================================
`,
      },
      "m6D3DTvRCDR6di8Mu"
    );
    console.log("✅ Email sent!");
  } catch (error) {
    console.error("Email error:", error);
  }

  /* ── 3. GOOGLE SHEETS ── */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyvAouj8t_PC7QFDnvEs5P0SipDJasaLEMkCRl9rkZGdVhTakpB8eg01zKTBRSgeQcW/exec";

try {
  if (action === "book") {
    // Save as Booking
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:       "saveBooking",
        name:         form.name,
        phone:        form.phone,
        email:        form.email,
        property:     property,
        size:         size,
        area:         selectedArea || "",
        pests:        pests.join(", "),
        kitchen:      "No",
        plans:        planSummary,
        finalPrice:   finalPrice,
        date:         bookingDate,
        slot:         bookingSlot,
        address:      form.address || "",
      }),
    });
    console.log("✅ Booking saved to Google Sheets!");
  } else {
    // Save as Lead
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:        "saveLead",
        name:          form.name,
        phone:         form.phone,
        email:         form.email,
        property:      property,
        size:          size,
        area:          selectedArea || "",
        pests:         pests.join(", "),
        "Kitchen & Bathroom": "No",
        plans:         planSummary,
        originalPrice: cartTotal,
        offer:         `${offerLabel} (${discountPct}% OFF)`,
        finalPrice:    finalPrice,
        submittedAt:   new Date().toLocaleString("en-IN"),
      }),
    });
    console.log("✅ Lead saved to Google Sheets!");
  }
} catch (error) {
  console.error("Sheets error:", error);
}

  onClose();
};
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* ══ MAIN MODAL ══ */}
      <div className="qf-overlay">
        <div className="qf-modal">

          {/* HEADER */}
          <div className="qf-header">
            <div className="qf-header-left">
              <span className="qf-mode-badge">
                {mode === "quote" ? "💰 Get Quote" : "📅 Book Service"}
              </span>
              <span className="qf-step-label">Step {step} of {totalSteps}</span>
            </div>
            <button className="qf-close" onClick={handleClose}>✕</button>
          </div>

          <div className="qf-progress">
            <div className="qf-progress-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="qf-body">
              <h2 className="qf-title">What kind of property needs Pest Control?</h2>
              <p className="qf-sub">Different properties need different solutions</p>
              <div className="qf-options-grid">
                {propertyTypes.map((p) => (
                  <div key={p.id}
                    className={`qf-option-card ${property === p.id ? "qf-selected" : ""}`}
                    onClick={() => setProperty(p.id)}>
                    <span className="qf-option-icon">{p.icon}</span>
                    <span className="qf-option-label">{p.label}</span>
                  </div>
                ))}
              </div>
              {property === "other" && (
                <div className="qf-other-box" style={{ marginBottom: 16 }}>
                  <div className="qf-other-title">🏠 Tell us about your property</div>
                  <p className="qf-other-sub">We service all types! Choose how to proceed:</p>
                  <div className="qf-other-options">
                    <div className="qf-other-card" onClick={() => { openWhatsApp("Hi, I need Pest Control for a Factory / Warehouse. Please assist."); onClose(); }}>
                      <span className="qf-other-icon">🏭</span>
                      <span className="qf-other-label">Factory / Warehouse</span>
                      <span className="qf-other-desc">Industrial & large properties</span>
                    </div>
                    <div className="qf-other-card" onClick={() => { openWhatsApp("Hi, I need Pest Control but I'm not sure about my property type."); onClose(); }}>
                      <span className="qf-other-icon">💬</span>
                      <span className="qf-other-label">WhatsApp Us</span>
                      <span className="qf-other-desc">We'll guide you</span>
                    </div>
                    <div className="qf-other-card" onClick={() => window.open("tel:+917718898455")}>
                      <span className="qf-other-icon">📞</span>
                      <span className="qf-other-label">Call Our Expert</span>
                      <span className="qf-other-desc">Talk & get instant help</span>
                    </div>
                  </div>
                </div>
              )}
              <button className="qf-btn-primary" disabled={!property}
                onClick={() => {
                  if (property === "commercial") { openWhatsApp("Hi, I need Pest Control for a Commercial Property."); onClose(); }
                  else if (property === "other") { return; }
                  else { setStep(2); }
                }}>
                {property === "other" ? "👆 Choose an Option Above" : "Continue →"}
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="qf-body">
              <h2 className="qf-title">Which pests need controlling?</h2>
              <p className="qf-sub">You can select multiple pests</p>
              <div className="qf-pest-grid">
                {pestOptions.filter(p => p.properties.includes(property)).map((p) => (
                  <div key={p.id}
                    className={`qf-pest-card ${pests.includes(p.id) ? "qf-selected" : ""}`}
                    onClick={() => togglePest(p.id)}>
                    <span className="qf-pest-icon">{p.icon}</span>
                    <span className="qf-pest-label">{p.label}</span>
                    {pests.includes(p.id) && <span className="qf-check">✓</span>}
                  </div>
                ))}
              </div>
              {pests.includes("other") && (
                <div className="qf-other-box">
                  <div className="qf-other-title">🤔 Not sure what pest it is?</div>
                  <p className="qf-other-sub">Choose how our expert can help:</p>
                  <div className="qf-other-options">
                    <label className="qf-other-card">
                      <span className="qf-other-icon">📸</span>
                      <span className="qf-other-label">Upload Pest Photo</span>
                      <span className="qf-other-desc">Our team will identify & call you</span>
                      <input type="file" accept="image/*" style={{ display: "none" }}
                        onChange={(e) => { if (e.target.files[0]) alert("✅ Photo received! We'll contact you within 30 minutes."); }} />
                    </label>
                    <div className="qf-other-card" onClick={() => window.open("https://wa.me/917718898455?text=Hi, I have a pest problem but I'm not sure what it is.")}>
                      <span className="qf-other-icon">💬</span>
                      <span className="qf-other-label">WhatsApp Us</span>
                      <span className="qf-other-desc">Send us a photo</span>
                    </div>
                    <div className="qf-other-card" onClick={() => window.open("tel:+917718898455")}>
                      <span className="qf-other-icon">📞</span>
                      <span className="qf-other-label">Call Our Expert</span>
                      <span className="qf-other-desc">Talk to us</span>
                    </div>
                  </div>
                </div>
              )}
            
                <div className="qf-btn-row">
                <button className="qf-btn-back" onClick={() => setStep(1)}>← Back</button>
                <button className="qf-btn-primary" disabled={pests.length === 0}
                  onClick={() => setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="qf-body">
              <h2 className="qf-title">Select your {property} size</h2>
              <p className="qf-sub">This helps us give you the right price</p>
              <div className="qf-size-list">
                {getSizes().map((s) => (
                  <label key={s} className={`qf-size-row ${size === s ? "qf-selected" : ""}`}>
                    <input type="radio" name="size" value={s}
                      checked={size === s} onChange={() => setSize(s)} />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <div className="qf-btn-row">
                <button className="qf-btn-back" onClick={() => setStep(2)}>← Back</button>
                <button className="qf-btn-primary" disabled={!size}
                  onClick={() => setStep(4)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="qf-body">
              <h2 className="qf-title">How often do you need Pest Control?</h2>
              <p className="qf-sub">Choose a plan — prices include GST</p>
              <div className="qf-offer-selector">
                <p className="qf-offer-label">🎉 Select Your Offer:</p>
                <div className="qf-offer-tabs">
                  {offers.map(o => (
                    <div key={o.id}
                      className={`qf-offer-tab ${selectedOffer === o.id ? "qf-offer-active" : ""}`}
                      onClick={() => setSelectedOffer(o.id)}>
                      {o.label} — {o.discount}% OFF
                    </div>
                  ))}
                </div>
              </div>
              <div className="qf-plans">
                {getRelevantPlans().map((plan) => (
                  <div key={plan.id} className="qf-plan-block">
                    <div className="qf-plan-header">
                      <span className="qf-plan-title">{plan.title}</span>
                      <button className="qf-see-details" type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDetailsPlan(plan);
                          setDetailsOpt(selectedPlans[plan.id] || plan.options[0]);
                          setShowDetails(true);
                        }}>
                        See Details
                      </button>
                    </div>
                    <div className="qf-plan-options">
                      {plan.options.map((opt) => {
                        const price = getPrice(plan.group, opt);
                        const isNA  = price === "NA" || price === undefined;
                        const disc  = isNA ? null : Math.round(applyDiscount(price, discountPct));
                        return (
                          <label key={opt}
                            className={`qf-plan-option ${selectedPlans[plan.id] === opt ? "qf-plan-selected" : ""} ${isNA ? "qf-plan-na" : ""}`}>
                            <input type="radio" name={plan.id} value={opt}
                              checked={selectedPlans[plan.id] === opt}
                              onChange={() => { if (!isNA) togglePlan(plan.id, opt); }}
                              disabled={isNA} />
                            <div className="qf-plan-opt-content">
                              <span className="qf-plan-opt-name">{opt}</span>
                              {isNA ? (
                                <span className="qf-plan-na-text">Not Available</span>
                              ) : (
                                <div className="qf-price-row">
                                  <span className="qf-price-original">₹{price?.toLocaleString("en-IN")}</span>
                                  <span className="qf-price-final">₹{disc?.toLocaleString("en-IN")}</span>
                                  <span className="qf-price-save">Save ₹{(price - disc)?.toLocaleString("en-IN")}</span>
                                </div>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(selectedPlans).length > 0 && (
                <div className="qf-cart-total">
                  <div className="qf-cart-row">
                    <span>Original Price</span>
                    <span className="qf-strikethrough">₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="qf-cart-row">
                    <span>Discount ({discountPct}% OFF)</span>
                    <span className="qf-saving">− ₹{discountAmt.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="qf-cart-row qf-cart-final">
                    <span>Final Price (GST Incl.)</span>
                    <span>₹{finalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
              <div className="qf-btn-row">
                <button className="qf-btn-back" onClick={() => setStep(3)}>← Back</button>
                <button className="qf-btn-primary"
                  disabled={Object.keys(selectedPlans).length === 0}
                  onClick={() => setStep(5)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="qf-body">
              <h2 className="qf-title">How would you like to proceed?</h2>
              <p className="qf-sub">Choose what works best for you</p>
              <div className="qf-action-cards">
                <div className={`qf-action-card ${action === "quote" ? "qf-action-selected" : ""}`}
                  onClick={() => setAction("quote")}>
                  <span className="qf-action-icon">💰</span>
                  <div className="qf-action-content">
                    <div className="qf-action-title">Get a Quote</div>
                    <div className="qf-action-desc">Receive detailed quote on WhatsApp & Email. Our team will contact you within 30 minutes.</div>
                  </div>
                  {action === "quote" && <span className="qf-action-check">✓</span>}
                </div>
                <div className={`qf-action-card ${action === "book" ? "qf-action-selected" : ""}`}
                  onClick={() => setAction("book")}>
                  <span className="qf-action-icon">📅</span>
                  <div className="qf-action-content">
                    <div className="qf-action-title">Book Service Now</div>
                    <div className="qf-action-desc">Choose your preferred date & time slot. Get instant booking confirmation.</div>
                  </div>
                  {action === "book" && <span className="qf-action-check">✓</span>}
                </div>
              </div>
              <div className="qf-mini-cart">
                <div className="qf-mini-cart-title">🛒 Your Cart</div>
                {Object.entries(selectedPlans).map(([planId, opt]) => {
                  const plan  = allPlans.find(p => p.id === planId);
                  const price = getPrice(plan?.group, opt);
                  const disc  = price && price !== "NA" ? Math.round(applyDiscount(price, discountPct)) : null;
                  return (
                    <div key={planId} className="qf-mini-cart-item">
                      <span>{opt}</span>
                      {disc && <span className="qf-mini-price">₹{disc.toLocaleString("en-IN")}</span>}
                    </div>
                  );
                })}
                <div className="qf-mini-cart-total">
                  <span>Total (after {discountPct}% OFF)</span>
                  <span>₹{finalPrice.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div className="qf-btn-row">
                <button className="qf-btn-back" onClick={() => setStep(4)}>← Back</button>
                <button className="qf-btn-primary" disabled={!action}
                  onClick={() => setStep(action === "book" ? 6 : 7)}>
                  {action === "book" ? "📅 Choose Date & Time →" : "💰 Get My Quote →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {step === 6 && action === "book" && (
            <div className="qf-body">
              <h2 className="qf-title">Choose Date & Time</h2>
              <p className="qf-sub">Select your preferred service date and time slot</p>
              <div className="qf-date-section">
                <label className="qf-date-label">📅 Select Date</label>
                <input type="date" className="qf-date-input" min={today}
                  value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              </div>
              {bookingDate && (
  <AvailableSlots
    date={bookingDate}
    area={selectedArea}
    bookingSlot={bookingSlot}
    setBookingSlot={setBookingSlot}
    scriptUrl="https://script.google.com/macros/s/AKfycbyvAouj8t_PC7QFDnvEs5P0SipDJasaLEMkCRl9rkZGdVhTakpB8eg01zKTBRSgeQcW/exec"
  />
)}
              <div className="qf-btn-row">
                <button className="qf-btn-back" onClick={() => setStep(5)}>← Back</button>
                <button className="qf-btn-primary" disabled={!bookingDate || !bookingSlot}
                  onClick={() => setStep(7)}>Continue →</button>
              </div>
            </div>
          )}

          {/* STEP 7 */}
          {step === 7 && (
            <div className="qf-body">
              <h2 className="qf-title">
                {action === "book" ? "✅ Confirm Your Booking" : "📲 Where to Send Your Quote?"}
              </h2>
              <p className="qf-sub">
                {action === "book" ? "Enter your details to confirm" : "We'll send your quote on WhatsApp & Email within minutes"}
              </p>
              <div className="qf-form">
                <input className="qf-input" placeholder="Your Full Name *"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <input className="qf-input" placeholder="Mobile Number *" type="tel"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <input className="qf-input" placeholder="Email Address *" type="email"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                {action === "book" && (
                  <input className="qf-input" placeholder="Full Address *" />
                )}
              </div>
              <div className="qf-final-cart">
                <div className="qf-final-cart-title">🛒 Order Summary</div>
                <div className="qf-final-details">
                  <div className="qf-final-row"><span>Property</span><strong>{property} — {size}</strong></div>
                  <div className="qf-final-row"><span>Pests</span><strong>{pests.join(", ")}</strong></div>
                  {action === "book" && (
                    <>
                      <div className="qf-final-row"><span>Date</span><strong>{bookingDate}</strong></div>
                      <div className="qf-final-row"><span>Time</span><strong>{bookingSlot}</strong></div>
                    </>
                  )}
                </div>
                <div className="qf-final-plans">
                  
                </div>
                <div className="qf-final-total">
                  <div className="qf-final-total-row">
                    <span>Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="qf-final-total-row qf-saving">
                    <span>{offers.find(o => o.id === selectedOffer)?.label} ({discountPct}% OFF)</span>
                    <span>− ₹{discountAmt.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="qf-final-total-row qf-grand-total">
                    <span>Total (GST Incl.)</span><span>₹{finalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>
              <div className="qf-btn-row">
                <button className="qf-btn-back"
                  onClick={() => setStep(action === "book" ? 6 : 5)}>← Back</button>
                <button className="qf-btn-primary qf-btn-submit"
                  disabled={!form.name || !form.phone || !form.email}
                  onClick={handleSubmit}>
                  {action === "book" ? "✅ Confirm Booking on WhatsApp" : "📲 Send My Quote on WhatsApp"}
                </button>
              </div>
            </div>
          )}

          {/* EXIT WARNING */}
          {showExit && (
            <div className="qf-exit-overlay">
              <div className="qf-exit-box">
                <h3>Are you sure you want to leave?</h3>
                <p>We're finding you the right pros and will send your quote fast and free!</p>
                <div className="qf-exit-btns">
                  <button className="qf-exit-quit" onClick={onClose}>Quit</button>
                  <button className="qf-exit-continue" onClick={() => setShowExit(false)}>Continue</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══ SERVICE DETAILS MODAL — OUTSIDE MAIN MODAL ══ */}
      {showDetails && detailsPlan && (
        <div className="qf-details-overlay" onClick={() => setShowDetails(false)}>
          <div className="qf-details-modal" onClick={(e) => e.stopPropagation()}>

            <div className="qf-details-header">
              <h3 className="qf-details-title">{detailsPlan.title}</h3>
              <button className="qf-close" onClick={() => setShowDetails(false)}>✕</button>
            </div>

            <div className="qf-details-body">

              {detailsOpt && serviceDescriptions[detailsPlan.group]?.warranty?.[detailsOpt] && (
                <div className="qf-detail-section qf-detail-warranty">
                  <span className="qf-detail-icon">🛡️</span>
                  <div>
                    <div className="qf-detail-label">Warranty Period</div>
                    <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group].warranty[detailsOpt]}</div>
                  </div>
                </div>
              )}

              <div className="qf-detail-section">
                <span className="qf-detail-icon">🔬</span>
                <div>
                  <div className="qf-detail-label">Treatment Method</div>
                  <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group]?.treatmentMethod}</div>
                </div>
              </div>
              {serviceDescriptions[detailsPlan.group]?.areaOfService && (
  <div className="qf-detail-section">
    <span className="qf-detail-icon">📍</span>
    <div>
      <div className="qf-detail-label">Area of Service</div>
      <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group].areaOfService}</div>
    </div>
  </div>
)}

              <div className="qf-detail-section">
                <span className="qf-detail-icon">📋</span>
                <div>
                  <div className="qf-detail-label">Service Description</div>
                  <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group]?.description}</div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">✅</span>
                <div>
                  <div className="qf-detail-label">Pests Covered</div>
                  <div className="qf-tags-wrap">
                    {serviceDescriptions[detailsPlan.group]?.pestsCovered.map(p => (
                      <span key={p} className="qf-tag qf-tag-green">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">❌</span>
                <div>
                  <div className="qf-detail-label">Pests NOT Covered</div>
                  <div className="qf-tags-wrap">
                    {serviceDescriptions[detailsPlan.group]?.pestsNotCovered.map(p => (
                      <span key={p} className="qf-tag qf-tag-red">{p}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">🧪</span>
                <div>
                  <div className="qf-detail-label">Chemicals Used</div>
                  <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group]?.chemicals}</div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">⚠️</span>
                <div>
                  <div className="qf-detail-label">Special Instructions</div>
                  <ul className="qf-detail-list">
                    {serviceDescriptions[detailsPlan.group]?.notes.map((n, i) => (
                      <li key={i}>{n}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">🏠</span>
                <div>
                  <div className="qf-detail-label">Customer to Provide</div>
                  <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group]?.customerToProvide}</div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">💳</span>
                <div>
                  <div className="qf-detail-label">Payment Terms</div>
                  <div className="qf-detail-value">{serviceDescriptions[detailsPlan.group]?.paymentTerms}</div>
                </div>
              </div>

              <div className="qf-detail-section">
                <span className="qf-detail-icon">📜</span>
                <div>
                  <div className="qf-detail-label">Terms & Conditions</div>
                  <ul className="qf-detail-list">
                    {serviceDescriptions[detailsPlan.group]?.termsAndConditions.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            <div className="qf-details-footer">
              <button className="qf-btn-back" onClick={() => setShowDetails(false)}>← Back to Plans</button>
              <button className="qf-btn-primary"
                onClick={() => {
                  if (detailsOpt) togglePlan(detailsPlan.id, detailsOpt);
                  setShowDetails(false);
                }}>
                ✅ Select This Plan
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}