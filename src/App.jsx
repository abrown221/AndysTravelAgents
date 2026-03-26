import { useState, useEffect, useRef } from "react";

// ââ THEME ââ
const DB="#1B3A5C",WG="#C49A3C",GR="#0F6E56",RD="#A32D2D",AM="#854F0B";
const GR_BG="#E1F5EE",AM_BG="#FAEEDA";
const PEOPLE=["Andy","Nic","Rose","Christina","Jim"];
const INI=["A","N","R","C","J"];
const PC=["#3B82F6","#EC4899","#F59E0B","#8B5CF6","#10B981"];
const LOC={bar:{l:"Barrocal",i:"ð¾"},cas:{l:"Cascais",i:"ð"},sin:{l:"Sintra",i:"ð°"},lis:{l:"Lisbon",i:"âï¸"},fly:{l:"Transit",i:"âï¸"}};
const LS={bar:{bg:"#E8F0E4",c:"#3D6B35",b:"#B5D4A8"},cas:{bg:"#DBE9F7",c:"#1B5AA5",b:"#A8C8ED"},sin:{bg:"#EDE5F5",c:"#6B3FA0",b:"#C9B8E0"},lis:{bg:"#FFF3E0",c:"#A5711B",b:"#F0D4A8"},fly:{bg:"#F0F0F0",c:"#888",b:"#D0D0D0"}};

// ââ HOTELS + EMERGENCY ââ
const HOTELS={
  bar:{name:"SÃ£o LourenÃ§o do Barrocal",q:"SÃ£o+LourenÃ§o+do+Barrocal+Monsaraz",phone:"+351266247140",res:"7921SF001432 / 7921SF001452",room:"Two Bedroom Barn Cottage + Farm Room"},
  cas:{name:"The Albatroz Hotel",q:"The+Albatroz+Hotel+Cascais",phone:"+351214847380",res:"72.937",room:"Deluxe Seaview w/ balcony"},
  lis:{name:"Bairro Alto Hotel",q:"Bairro+Alto+Hotel+Lisbon",phone:"+351213408288",res:"6753SF068835 / 6753SF069167",room:"Suite Chiado + Classic Corner Room"},
  fly:{name:null,q:null,phone:null}
};
const SOS=[
  {label:"Emergency",phone:"112",note:"Police / Fire / Ambulance â free, 24/7"},
  {label:"SaÃºde 24 Health Line",phone:"+351808242424",note:"Medical advice, English available"},
  {label:"SOS Pharmacy",phone:"+351800202134",note:"Nearest open farmÃ¡cia"},
  {label:"US Embassy Lisbon",phone:"+351217273300",note:"Av. das ForÃ§as Armadas"},
  {label:"Barrocal Reservations",phone:"+351266247140"},
  {label:"Barrocal Spa",phone:"+351266247142"},
  {label:"Bairro Alto Hotel",phone:"+351213408288"},
];

// ââ BARROCAL TAB DATA ââ
// Updated Mar 24 from Carolina Calado's concierge reply (concierge@barrocal.pt)
const BDAYS=[
  {day:"Sat, Mar 28",label:"Day 1 â Arrival",items:[
    {time:"9:30 AM",name:"ð Shuttle: LIS Airport â Barrocal",ppl:[1,1,1,1,1],cancel:"24h",note:"â CAROLINA CONFIRMED â Mercedes Class V. Car seat for Rose needed. UA 64 lands 8:10 AM, clear immigration ~9:00â9:30."},
    {time:"4:30 PM",name:"ð Spa â Massage + One-Hour Facial",ppl:[0,1,0,1,0],cancel:"same-day",note:"â CAROLINA CONFIRMED â Nicole + Christina. Carolina recommended Massage + One-Hour Facial instead of the Purifying Massage + Oil Bath we requested (those aren't on the menu). Spa menu PDF attached to her email."},
  ]},
  {day:"Sun, Mar 29",label:"Day 2 â Cookies, Wine & Ãvora",items:[
    {time:"9:00 AM",name:"ð¯ Honey Tasting (replaces Beekeeping)",ppl:[1,1,1,1,1],cancel:"TBD",note:"â ï¸ OPTIONAL Â· NOT BOOKED â Decide on arrival. Beekeeping is 8+ only, so Rose can't participate. Honey Tasting instead: tour of pollinators on-site, observe bees safely, beeswax demo, taste two honeys. Optional 4Ã4 Jeep ride to hives. Carolina waiting for go-ahead."},
    {time:"11:30 AM",name:"ðª Cookie Workshop",ppl:[0,0,1,1,1],cancel:"12h",note:"â BOOKED â Rose, Christina, Jim. While Andy + Nicole are at wine tasting."},
    {time:"12:00 PM",name:"ð· Fita Preta Wines",ppl:[1,1,0,0,0],cancel:"24h",note:"â BOOKED â 12:00 PM Private Wine Tasting with food pairing (6 heroic wines). Andy + Nicole."},
    {time:"~3:00 PM",name:"ðï¸ Ãvora guided tour",ppl:[1,1,0,0,0],cancel:"â",note:"â³ PENDING â Carolina checking guide availability. UNESCO World Heritage city: Roman Temple, bone chapel, cathedral. 1.5â2 hour guided walking tour. Could combine with Fita Preta visit... Unique chance to see this historic city while in the region.",flag:"Carolina checking guide availability",price:"Guide TBD"},
  ]},
  {day:"Mon, Mar 30",label:"Day 3 â Clay, Shelter & Farewell",sub:"â ï¸ Little Lisbon balance â¬280 due today via PayPal",items:[
    {time:"11:30 AM",name:"ð¨ Playing with Clay",ppl:[0,0,1,1,1],cancel:"12h",note:"Rose, Christina, Jim. Rose molds and shapes her own keepsakes to take home. Last grandparent craft activity."},
    {time:"2:00 PM",name:"ð Spa â Herbal Compress",ppl:[0,1,0,0,0],cancel:"same-day",note:"â CAROLINA CONFIRMED â Nicole solo."},
    {time:"3:30 PM",name:"ð¦ Animal Shelter Building",ppl:[1,1,1,0,0],cancel:"4h",note:"â BOOKED â Moved from Apr 1 (only date colleague is on property). Andy, Nicole, Rose build birdhouses for 75 bird species. Rose leaves something behind at Barrocal.",flag:"Moved from Apr 1 â colleague only available Mar 30"},
    {time:"~7:00 PM",name:"ð½ï¸ Cottage Farewell Dinner",ppl:[1,1,1,1,1],cancel:"24h",note:"â CAROLINA CONFIRMED â Private catered in your cottage: candles, flowers, estateâs best. Grandparentsâ farewell night. Mar 30."},
    {time:"~9:00 PM",name:"ð Nocturnal Walk",ppl:[1,1,0,1,1],cancel:"12h",note:"â CONFIRMED â All 4 adults. Estate biologist, flashlights, nocturnal fauna. Zero light pollution. Rose sleeps after dinner."},
  ]},
  {day:"Tue, Mar 31",label:"Day 4 â Horses, Wine Blending & The Split",sub:"Grandparents depart for Cascais",items:[
    {time:"~8:30 AM",name:"ð Grandparents Shuttle â Cascais",ppl:[0,0,0,1,1],cancel:"24h",note:"â CAROLINA CONFIRMED â Mercedes Class Limo for 2 + luggage. ~2.5 hours to Cascais. Reunite Apr 2 in Lisbon."},
    {time:"~11:00 AM",name:"ð´ Discovering Horses",ppl:[1,1,1,0,0],cancel:"4h",note:"â BOOKED â Lusitano horses â grooming, feeding, learning about their care. Designed for kids. Rose gets quality time with horses without the grandparent farewell emotion."},
    {time:"~5:00 PM",name:"ð· Wine Blending",ppl:[1,1,0,0,0],cancel:"12h",note:"Create your own wine. Labeled bottle to take home."},
  ]},
  {day:"Wed, Apr 1",label:"Day 5 â Sintra & Farewell Alentejo",items:[
    {time:"9:30 AM",name:"ð° Monsaraz village",ppl:[1,1,1,0,0],cancel:"â",note:"Medieval walled village, 4 km. Castle, Witchesâ Tower (fairy tale for Rose), oldest bullring in Portugal."},
    {time:"1:00 PM",name:"ð¸ Flower Arranging",ppl:[0,1,1,0,0],cancel:"24h",note:"â CONFIRMED â 1:00 PM. Nicole + Rose forage wildflowers with florist. Late March = peak bloom."},
    {time:"3:00 PM",name:"ð¯ï¸ Candle Making",ppl:[1,1,1,0,0],cancel:"12h",note:"Beeswax + aromatic herbs from the estate. Wonderful keepsakes."},
    {time:"9:40 AMâ5:00 PM",name:"ð° Sintra Palaces",ppl:[0,0,0,1,1],cancel:"24h",price:"Guide + fuel incl.",note:"FULLY CONFIRMED through Albatroz/JosÃ©. Pena Palace â Quinta da Regaleira â Azenhas do Mar â Cabo da Roca â coastal road back. Full day."},
    {time:"~8:00 PM",name:"ð½ï¸ Dinner in Cascais",ppl:[0,0,0,1,1],cancel:"â",note:"JosÃ© recommended Monte Mar or MarÃ© â both on road to Guincho, sea views, ~10 min from Albatroz. Tell JosÃ© our pick."},
  ]},
];

const TODOS=[
  {cat:"red",label:"ð´ ACTION NEEDED NOW",items:[
    {id:1,text:"Send Little Lisbon balance reply draft",detail:"Acknowledge balance, confirm we'll pay. â ï¸ Balance â¬280 due by Mon Mar 30 via PayPal.",link:"https://mail.google.com/mail/u/0/#drafts?compose=19d2072e61e27596",linkLabel:"Open draft",done:false},
    {id:2,text:"Pay Little Lisbon balance â â¬280 via PayPal",detail:"Due by Mon Mar 30. PayPal to LITTLE LISBON.",done:false},
    {id:3,text:"Choose Wed dinner â Monte Mar or MarÃ©",detail:"Both on road to Guincho, sea views, ~10 min from Albatroz. Tell JosÃ© our pick.",done:false},
    {id:4,text:"Send Carolina reply draft",detail:"Dinner TBD note. Draft ready in Gmail.",link:"https://mail.google.com/mail/u/0/#drafts?compose=19d277543543c0b0",linkLabel:"Open draft",done:false},
    {id:5,text:"Send JosÃ© reply draft (Portuguese For a Day question)",detail:"Ask if we should switch to PFAD guide for Sintra. Draft ready in Gmail.",link:"https://mail.google.com/mail/u/0/#drafts?compose=19d277556c37654b",linkLabel:"Open draft",done:false},
    {id:6,text:"Travel insurance for grandparents",detail:"â ï¸ DEPARTURE IN 3 DAYS. Billy never arranged it. May need to purchase directly â World Nomads or Allianz.",done:false},
    {id:7,text:"Reply to Lizzie (Springwell) â activities to add?",detail:"Check if Springwell wants to add any activities to itinerary. Confirmation numbers available.",done:false},
  ]},
  {cat:"yellow",label:"ð¡ AWAITING RESPONSES",items:[
    {id:8,text:"Carolina (Barrocal) â Ãvora guide availability",detail:"Checking if local guide is available for Ãvora visit on Sun Mar 29 (after Fita Preta).",done:false},
    {id:9,text:"Bairro Alto Hotel â Sent Mar 24",detail:"Fado recommendation (kid-friendly, Good Friday Apr 3) Â· Airport transfer Apr 5 (van for 5 + luggage + car seat, 7:45 AM pickup) Â· Confirmation number acknowledgement.",done:false},
  ]},
  {cat:"orange",label:"ð  OPTIONAL / BEFORE YOU GO",items:[
    {id:11,text:"United Airlines meal preorder",detail:"Optional. Preorder meals for Mar 27 EWRâLIS (Polaris). Especially for Rose.",done:false},
    {id:12,text:"Download offline maps",detail:"Google Maps offline: Lisbon + Cascais + Alentejo/Monsaraz. Do before leaving home Wi-Fi.",done:false},
    {id:13,text:"Review Barrocal spa + dine-in menu PDFs",detail:"Carolina attached PDFs. Pick spa treatments and dine-in menu selections before arriving.",done:false},
  ]},
];

// ââ CALENDAR DATA ââ
const CAL=[
  {date:"Fri, Mar 27",n:0,title:"Transit â DCA â EWR â LIS",iso:"2026-03-27",hotel:"fly",free:2,prep:"Rose's blanket from home for Polaris pod. Pajamas in carry-on. Noise-canceling headphones. Snacks for EWR layover.",locs:[{w:[1,1,1,1,1],l:"fly"}],acts:[
    {t:"~3:30 PM",n:"ð Head to DCA",p:[1,1,1,1,1],d:"Andy, Nicole, and Rose Uber to Reagan National (DCA). Quick 15â20 min ride from home. Bring your own car seat for Rose.\n\nâ DCAcar BOOKED â Trip #XYMNV1. Executive sedan pickup for Christina + Jim from their home at 3:30 PM. Flight tracking included. Free cancel up to 4h prior.\n\nð DCAcar: (240) 477-9877 Â· info@dcacar.com",phone:"2404779877",mapQ:"Reagan+National+Airport+DCA",links:[{t:"DCAcar â book",u:"https://dcacar.ridebitsapp.com/central/new_reservation"}]},
    {t:"6:00 PM",n:"âï¸ UA 4180 Â· DCA â EWR",p:[1,1,1,1,1],d:"All 5 on the same flight, different cabins.\n\nâ¢ Andy/Nicole/Rose: United First â seats 3A, 3C, 3D\nâ¢ Christina/Jim: Economy Plus â seats 7A, 7B\n\nConfirmation codes:\nâ¢ IMH4SG (Andy, Nicole, Rose)\nâ¢ GZDXFX (Christina, Jim)\n\n1h 35m flight. Arrives EWR 7:35 PM."},
    {t:"7:35 PM",n:"EWR layover",p:[1,1,1,1,1],d:"~2 hour connection at Newark Liberty. All 5 meet up.\n\nPolaris lounge access for Andy/Nicole/Rose (Polaris ticket holders). Christina + Jim won't have lounge access unless you have a guest pass.\n\nRose: snacks, change into pajamas, burn energy before boarding. Gate closes ~9:00 PM."},
    {t:"9:30 PM",n:"âï¸ UA 64 Â· EWR â LIS",p:[1,1,1,1,1],d:"Boeing 787-10 Dreamliner. Overnight flight, 6h 40m.\n\nâ¢ Andy/Nicole/Rose: Polaris Business â seats 10F, 10D, 10A (lie-flat pods, Saks bedding)\nâ¢ Christina/Jim: Economy â seats 20E, 20F\n\nRose should be asleep within 30 min of takeoff. Arrives Lisbon 8:10 AM. Set watches +5 hours."},
  ]},
  {date:"Sat, Mar 28",n:1,title:"Arrival & Rest",iso:"2026-03-28",hotel:"bar",free:7.5,prep:"Car seat for Rose in transfer van. Water + snacks for 2-hour drive. Sunscreen.",locs:[{w:[1,1,1,1,1],l:"bar"}],acts:[
    {t:"8:10 AM",n:"Arrive LIS â Barrocal",p:[1,1,1,1,1],from:"A",src:1,booked:true,d:"Land at Lisbon (UA 64, 787-10). Private van with car seat for Rose at arrivals.\n\nIf Fastrack VIP booked: greeter at arrivals handles luggage + customs. Important: NO fast-track for passport control (non-Schengen). Lines 30â90+ min.\n\nDrive to Barrocal ~2 hours through rolling Alentejo plains, cork oaks, wildflowers. Rose will nap.",cancel:"24h",mapQ:"Lisbon+Airport+LIS",links:[{t:"Barrocal",u:"https://barrocal.pt"},{t:"Fastrack VIP",u:"https://fastrackvip.com/airports/lisbon/"}]},
    {t:"~10:30",n:"Check in at Barrocal",p:[1,1,1,1,1],d:"780-hectare estate, same family 200 years. Meet JerÃ³nimo the donkey AND baby donkey Jeremias! ð´ 2â3 bedroom cottage with dining area (essential for Day 3 farewell dinner).\n\nVirtuoso/Amex FHR: upgrade + $100 spa credit + early check-in.",links:[{t:"Barrocal",u:"https://barrocal.pt"},{t:"Amex FHR",u:"https://www.americanexpress.com/en-us/travel/discover/property/Portugal/Monsaraz/Sao-Lourenco-Do-Barrocal"}]},
    {t:"12:30",n:"Lunch at HortelÃ£o",p:[1,1,1,1,1],d:"Estate's seasonal garden restaurant. Light Alentejo dishes from the organic garden next door. Relaxed, outdoor, kid-friendly. The right first meal after an overnight flight."},
    {t:"2:00 PM",n:"Pool & nap",p:[1,1,1,1,1],d:"Children's pool + main pool (Souto de Moura granite rock design). Everyone resets from the flight."},
    {t:"4:30 PM",n:"Spa â Susanne Kaufmann",p:[0,1,0,1,0],from:"B",src:1,booked:true,par:true,d:"â BOOKED â Nicole + Christina. Massage + One-Hour Facial (Carolina's recommendation). Spa in a 40-metre vaulted stone corridor.\n\nð spa@barrocal.pt / +351 266 247 142",phone:"+351266247142",cancel:"same-day",links:[{t:"Barrocal Spa",u:"https://barrocal.pt/wellness/"}]},
    {t:"4:30 PM",n:"ð´ Estate exploration",p:[1,0,1,0,1],par:true,d:"Andy, Jim, and Rose explore the estate. Bikes for adults (complimentary), donkey cart for Rose, visit animals, trails through vineyards and olive groves past the ancient menhir.\n\nThree generations wandering 780 hectares in late afternoon light."},
    {t:"7:30 PM",n:"Dinner at restaurant",p:[1,1,1,1,1],d:"Farm-to-table, estate DOC wines. Children's menu. Request outdoor terrace â sunset views toward Monsaraz. Early night â everyone still adjusting."},
  ]},
  {date:"Sun, Mar 29",n:2,title:"Cookies, Wine & Ãvora",iso:"2026-03-29",hotel:"bar",free:6.5,prep:"Fita Preta Wines confirmed at 12 PM. Ãvora guide pending.",locs:[{w:[1,1,1,1,1],l:"bar"}],acts:[
    {t:"~9:00",n:"Breakfast (sleep in!)",p:[1,1,1,1,1],d:"Legendary spread: fresh fruits, artisan pastries, regional cheeses, cured meats, estate honey."},
    {t:"~11:00 AM",n:"ð¯ Honey Tasting",p:[1,1,1,1,1],from:"B",src:1,d:"â ï¸ OPTIONAL Â· NOT BOOKED â Decide on arrival. Beekeeping is 8+ only (Rose is 4), so this would be a Honey Tasting instead: tour of pollinators, observe bees safely, beeswax demo, taste two honeys. Optional 4Ã4 Jeep ride to hives. Carolina is waiting for our go-ahead.",cancel:"24h",links:[{t:"Barrocal",u:"https://barrocal.pt/experiences/"}]},
    {t:"~11:00",n:"Quick lunch",p:[1,1,1,1,1],d:"Light at HortelÃ£o before the groups split for the afternoon."},
    {t:"12:00 PM",n:"â­ Fita Preta Wines + food pairing",p:[1,1,0,0,0],from:"A",src:1,booked:true,par:true,d:"â CONFIRMED â 12:00 PM Private Wine Tasting with food pairing at Fita Preta Wines. Andy + Nicole. Fita Preta is a celebrated Alentejo winery â natural wines, bold reds. Food pairing makes this a proper tasting lunch.\n\nð¡ Carolina also recommends: Ãvora City visit (self-guided or guided) while in the area for wine. 15th-century UNESCO World Heritage city, Roman Temple, bone chapel. Could combine winery + Ãvora into one outing.",cancel:"24h",mapQ:"Fita+Preta+Vinhos+Vidigueira",links:[{t:"Fita Preta",u:"https://www.fitapreta.com/"},{t:"Ãvora",u:"https://maps.google.com/?q=Ãvora+Portugal"}]},
    {t:"~11:30",n:"ðª Cookie workshop",p:[0,0,1,1,1],from:"B",src:1,booked:true,par:true,d:"â BOOKED â Rose bakes with Christina + Jim while Andy+Nicole are at the winery. Rolling pins, cookie cutters, decorating.",cancel:"12h",links:[{t:"Barrocal",u:"https://barrocal.pt/experiences/"}]},
    {t:"~3:00",n:"ðï¸ Ãvora guided tour",p:[1,1,0,0,0],from:"B",src:1,d:"â³ PENDING â Carolina checking guide availability. UNESCO World Heritage city: Roman Temple, bone chapel, cathedral. 1.5â2 hour guided walking tour. Could combine with Fita Preta winery visit. If no guide available, self-guided with Carolina's recommendations.",mapQ:"Ãvora+Portugal",links:[{t:"Ãvora",u:"https://maps.google.com/?q=Ãvora+Portugal"}]},
    {t:"~5:00",n:"Reunite & pool",p:[1,1,1,1,1],d:"Hotel bar in the old olive oil mill. Estate wines + cocktails."},
    {t:"7:00 PM",n:"Early dinner",p:[1,1,1,1,1],d:"Rose to bed after. Easy evening â"nocturnal walk moved to Mon."},
  ]},
  {date:"Mon, Mar 30",n:3,title:"Clay, Shelter & Farewell",iso:"2026-03-30",hotel:"bar",free:5,note:"ð Grandparents' last day at Barrocal",prep:"Warm layers for nocturnal walk tonight. Sun hats, sunscreen.",locs:[{w:[1,1,1,1,1],l:"bar"}],acts:[
    {t:"~9:00",n:"Breakfast",p:[1,1,1,1,1],d:"Big leisurely breakfast. No rush â morning activities are relaxed."},
    {t:"~11:30",n:"ð¨ Playing with clay",p:[0,0,1,1,1],from:"B",src:1,booked:true,par:true,d:"â BOOKED â Kid-focused creative workshop with the grandparents. Rose molds, shapes, and creates her own keepsakes to bring home.\n\nLast grandparent craft activity before they head to Cascais tomorrow.",cancel:"12h"},
    {t:"~11:30",n:"Andy + Nicole free",p:[1,1,0,0,0],par:true,d:"Pool, bar, walk to Monsaraz, or cottage terrace with wine."},
    {t:"~12:30",n:"Lunch & regroup",p:[1,1,1,1,1],d:"Everyone at HortelÃ£o before the afternoon split."},
    {t:"2:00 PM",n:"ð Spa â Herbal Compress",p:[0,1,0,0,0],from:"B",src:1,booked:true,par:true,d:"â BOOKED â Nicole solo session. Herbal Compress Treatment at the Susanne Kaufmann spa. The 40-metre vaulted stone corridor all to yourself.",cancel:"same-day"},
    {t:"~2:00",n:"ð° Christina â Monsaraz",p:[0,0,0,1,0],par:true,d:"â ï¸ OPTIONAL Â· NOT BOOKED â Carolina will arrange a car drop-off. Medieval walled village ~4 km from Barrocal. Castle, Witches' Tower, tiny bullring, local shops, cafÃ©s. For pottery shops, go to Corval instead. Hill is challenging to walk â car recommended.",mapQ:"Monsaraz+Castle+Portugal"},
    {t:"~2:00",n:"â Andy, Jim & Rose free",p:[1,0,1,0,1],par:true,d:"Pool, playground, estate trails, visit the donkeys. Relaxed afternoon before the farewell dinner."},
    {t:"3:30 PM",n:"ð¦ Animal shelter building",p:[1,1,1,0,0],from:"B",src:1,booked:true,d:"â BOOKED â Moved from Apr 1. Colleague running this is ONLY on property Mar 30. Andy, Nicole, Rose build birdhouses for 75 bird species. She leaves something behind at Barrocal.",cancel:"4h"},
    {t:"~5:00",n:"Reunite & pool",p:[1,1,1,1,1],d:"Clean up for farewell dinner."},
    {t:"~7:00",n:"ð½ï¸ Cottage farewell dinner",p:[1,1,1,1,1],from:"B",src:1,booked:true,d:"THE farewell dinner. Private catered in your cottage: candles, flowers, estate's best. Grandparents' farewell. Mar 30.",links:[{t:"Barrocal dining",u:"https://barrocal.pt/gastronomy/"}]},
    {t:"~9:00 PM",n:"ð Nocturnal Walk",p:[1,1,0,1,1],from:"B",src:1,booked:true,d:"â CONFIRMED â All 4 adults. Estate biologist, flashlights, nocturnal fauna. Zero light pollution. Rose sleeps after dinner.",cancel:"12h",links:[{t:"Barrocal",u:"https://barrocal.pt/experiences/"}]},
  ]},
  {date:"Tue, Mar 31",n:4,title:"The Split",iso:"2026-03-31",hotel:"bar",free:7,note:"â ï¸ Grandparents depart for Cascais",prep:"Nothing special for family of 3 â slow creative day on estate.",locs:[{w:[1,1,1,0,0],l:"bar"},{w:[0,0,0,1,1],l:"cas"}],acts:[
    {t:"~8:30",n:"ð Grandparents â Cascais",p:[0,0,0,1,1],from:"A",src:1,booked:true,loc:"cas",d:"â CAROLINA CONFIRMED â Mercedes Class Limo for 2 + luggage. ~2.5 hours to The Albatroz. Reunite Apr 2 in Lisbon.",cancel:"24h",mapQ:"The+Albatroz+Hotel+Cascais",links:[{t:"The Albatroz",u:"https://thealbatrozcollection.com"}]},
    {t:"~11:00",n:"ð  Check in The Albatroz",p:[0,0,0,1,1],loc:"cas",conf:"72.937",d:"â CONFIRMED â Deluxe Seaview room with balcony. Duke of LoulÃ©'s palace (1873). Cliff between two beaches.\n\nð Reservations: +351 214 847 383 (JosÃ© Mascarenhas)",mapQ:"The+Albatroz+Hotel+Cascais",links:[{t:"The Albatroz",u:"https://thealbatrozcollection.com"}]},
    {t:"2:00 PM",n:"ð¶ Private Walking Tour of Cascais",p:[0,0,0,1,1],from:"A",src:1,booked:true,loc:"cas",d:"â CONFIRMED â Guide: Nuno FrazÃ£o via Lusoexclusive. 3-4 hours, 2:00 PM start. Includes entrance to PalÃ¡cio da Cidadela. English-speaking guide with expertise in architecture + local culture. Cascais monuments, museums, stories.",cancel:"TBD",mapQ:"Cascais+Historic+Center",links:[{t:"Cascais",u:"https://www.visitcascais.com"}]},
    {t:"6:00 PM",n:"ð½ï¸ Dinner at The Albatroz",p:[0,0,0,1,1],loc:"cas",booked:true,d:"â BOOKED â Hotel restaurant, 6:00 PM, 2 guests. Classic seafood, Atlantic sunset. Right downstairs. Early dinner after travel + walking tour.",mapQ:"The+Albatroz+Hotel+Cascais"},
    {t:"~11:00",n:"ð´ Discovering Horses",p:[1,1,1,0,0],from:"B",src:1,booked:true,loc:"bar",d:"Lusitano horses â grooming, feeding, learning about their care and the bond between humans and horses. Designed for kids. Rose gets quality time with the horses alongside Andy and Nicole, without the grandparent farewell emotion. She'll be in heaven.",cancel:"4h"},
    {t:"12:30",n:"Lunch & nap",p:[1,1,1,0,0],loc:"bar",d:"HortelÃ£o or picnic. Rose naps."},
    {t:"~3:00",n:"â Free afternoon",p:[1,1,1,0,0],loc:"bar",d:"No scheduled activity. Pool, playground, animals, boutique. First day without grandparents â pace should reflect that. Wine blending at 5 PM (booked).\n\nð¡ OPTIONAL: Visit baby donkey Jeremias + JerÃ³nimo ð´"},
    {t:"~5:00",n:"ð· Wine blending",p:[1,1,0,0,0],from:"B",src:1,booked:true,loc:"bar",d:"Create your own wine. Labeled bottle to take home.",cancel:"12h"},
    {t:"7:00 PM",n:"Dinner (family of 3)",p:[1,1,1,0,0],loc:"bar",d:"Intimate evening at the restaurant."},
  ]},
  {date:"Wed, Apr 1",n:5,title:"Sintra & Farewell Alentejo",iso:"2026-04-01",hotel:"bar",free:8.5,prep:"Camera charged. Sintra fully confirmed through Albatroz/JosÃ©. Flower arranging at 1 PM, candle making at 3 PM.",locs:[{w:[1,1,1,0,0],l:"bar"},{w:[0,0,0,1,1],l:"sin"}],acts:[
    {t:"9:40 AMâ5:00 PM",n:"ð° Sintra palaces",p:[0,0,0,1,1],from:"A",src:1,booked:true,loc:"sin",d:"â FULLY CONFIRMED through Albatroz/JosÃ©:\n\nPick-up at hotel 9:40 AM. Dedicated English-speaking guide inside palaces (not just driver). Sedan with guide fee + fuel included.\n\nRoute: Pena Palace (10:30 AM tickets, 2 SÃ©nior) â Quinta da Regaleira (12:30 PM, Initiation Well) â lunch at Azenhas do Mar (2:00 PM) â Cabo da Roca (westernmost point) â coastal road back to Cascais.\n\nGuide expertise in architecture + local culture. Full day, expertly paced. Unforgettable.",phone:"+351219237300",cancel:"24h",mapQ:"Pena+Palace+Sintra",links:[{t:"Pena Palace",u:"https://www.parquesdesintra.pt/en/parks-and-monuments/park-and-national-palace-of-pena/"}]},
    {t:"~8:00 PM",n:"ð½ï¸ Dinner in Cascais",p:[0,0,0,1,1],loc:"cas",d:"â³ JosÃ© recommended Monte Mar or MarÃ© â both on road to Guincho, sea views, ~10 min from hotel. Both offer seafood, character, and Atlantic views similar to Mar do Inferno (closed Wednesdays). Awaiting Andy's choice.",mapQ:"Cascais+Restaurants"},
    {t:"8:30",n:"Breakfast + animals",p:[1,1,1,0,0],loc:"bar",d:"Rose's last visit with JerÃ³nimo + baby donkey Jeremias. Say goodbye. She'll talk about those donkeys for months."},
    {t:"~9:30",n:"ð° Monsaraz village",p:[1,1,1,0,0],loc:"bar",d:"Medieval walled village, 4 km. 13th-century castle, Witches' Tower (fairy tale for Rose), oldest bullring in Portugal. Artisan pottery + woven textiles.\n\n(Animal shelter building moved to Mar 30 â colleague only available that day.)",mapQ:"Monsaraz+Castle+Portugal",links:[{t:"Monsaraz",u:"https://maps.google.com/?q=Monsaraz+Castle+Portugal"}]},
    {t:"12:30",n:"Lunch in Monsaraz",p:[1,1,1,0,0],loc:"bar",d:"Village terrace over the lake. AÃ§orda, migas, grilled black pork."},
    {t:"1:00 PM",n:"ð¸ Flower arranging",p:[0,1,1,0,0],from:"B",src:1,booked:true,loc:"bar",d:"â CONFIRMED â 1:00 PM. Nicole + Rose forage wildflowers with a florist on the estate. Late March = peak bloom. Fits before candle making at 3:00 PM.",cancel:"24h"},
    {t:"3:00 PM",n:"ð¯ï¸ Candle making",p:[1,1,1,0,0],from:"B",src:1,booked:true,loc:"bar",d:"Beeswax + aromatic herbs from the estate. Wonderful keepsakes.",cancel:"12h"},
    {t:"~5:00",n:"â Pool & pack",p:[1,1,1,0,0],loc:"bar",d:"Last swim. Start packing for Lisbon transfer tomorrow.\n\nð¡ OPTIONAL: Horseback riding trail on the estate â ask Carolina for availability."},
    {t:"7:00 PM",n:"Farewell dinner",p:[1,1,1,0,0],loc:"bar",d:"Last Alentejo evening. Final estate wine. View of Monsaraz lit by last light."},
  ]},
  {date:"Thu, Apr 2",n:6,title:"Reunite in Lisbon!",iso:"2026-04-02",hotel:"lis",free:7.5,prep:"Download Google Maps offline: Lisbon + Cascais regions before leaving Barrocal Wi-Fi.",locs:[{w:[1,1,1,1,1],l:"lis"}],acts:[
    {t:"8:30 AM",n:"âµ Yacht cruise â Katerina Cranch",p:[0,0,0,1,1],from:"A",src:1,booked:true,d:"â CONFIRMED â Katerina Cranch, 12m yacht. 2-hour coastal cruise from Cascais Marina. Captain, fuel, paddle boards, welcome drinks included. 8:30 AM departure.\n\nLogistics: Check out of Albatroz. Leave luggage with concierge. Walk to marina (~10 min). After cruise: private car transfer to Bairro Alto Hotel (luggage pre-loaded from hotel â no backtracking needed).",cancel:"24h",mapQ:"Cascais+Marina+Portugal",links:[{t:"Cascais sailing",u:"https://www.viator.com/Cascais/d28587-ttd"}]},
    {t:"~10:30 AM",n:"ð Private car â Lisbon",p:[0,0,0,1,1],from:"A",src:1,booked:true,d:"â CONFIRMED â Private car from Cascais Marina to Bairro Alto Hotel. Luggage pre-loaded from hotel â no backtracking needed. After 2-hour yacht cruise.",mapQ:"Bairro+Alto+Hotel+Lisbon"},
    {t:"8:00 AM",n:"ð Barrocal â Lisbon",p:[1,1,1,0,0],from:"A",src:1,booked:true,d:"â CAROLINA CONFIRMED â Mercedes E Class. Car seat for Rose. Barrocal shuttle, ~2 hours. Rose naps.",cancel:"24h",links:[{t:"Barrocal",u:"https://barrocal.pt"}]},
    {t:"1:00 PM",n:"ð´ Lunch & nap",p:[1,1,1,0,0],par:true,d:"Back to hotel. Rose needs rest before Alfama. Critical recharge."},
    {t:"1:00 PM",n:"ðï¸ Chiado free time",p:[0,0,0,1,1],par:true,d:"Christina + Jim explore: Bertrand (world's oldest bookshop, 1732), Carmo Convent (roofless 1755 church â architecturally haunting), Manteigaria pastÃ©is de nata. All 5-min walk from hotel.",mapQ:"Carmo+Convent+Lisbon",links:[{t:"Carmo Convent",u:"https://maps.google.com/?q=Carmo+Convent+Lisbon"}]},
    {t:"3:00 PM",n:"ð¶ Little Lisbon â Express Lisbon Tour",p:[1,1,1,1,1],from:"A",src:1,booked:true,d:"â FULLY CONFIRMED by Mariana â Thu Apr 2, 3:00 PM.\n'Express Lisbon' private family tour: 2-hour tuk-tuk ride + 1-hour walking tour with scavenger hunt.\nGuide + driver meet at Bairro Alto Hotel.\n\nRoute: Baixa â Chiado â Bairro Alto â PrÃ­ncipe Real â Mouraria â Alfama. Viewpoints: Senhora do Monte, Portas do Sol/Santa Luzia, SÃ£o Pedro de AlcÃ¢ntara. Kids' games + pastry included.\n\nScavenger hunt options (choose at start): Alfama (ends Campo das Cebolas) OR Bairro Alto (ends PraÃ§a D. LuÃ­s I).\n\nBalance payment due by Mon Mar 30 via PayPal.\n\nð +351 912 800 647 Â· info@lisbonforkids.com (Mariana)",phone:"+351912800647",cancel:"24h",mapQ:"Alfama+Lisbon",links:[{t:"Little Lisbon",u:"https://www.lisbonforkids.com/tuk-tuk-tours"}]},
    {t:"~4:30",n:"ð° Alfama + Castle",p:[1,1,1,1,1],d:"Tile streets, peacocks, ramparts, Children's Centre. Ginjinha for adults.",mapQ:"Castelo+SÃ£o+Jorge+Lisbon",links:[{t:"Castelo",u:"https://maps.google.com/?q=Castelo+SÃ£o+Jorge+Lisbon"}]},
    {t:"7:00 PM",n:"ð½ï¸ Early dinner",p:[1,1,1,0,0],par:true,d:"Family eats early. Rose to bed. Quiet evening."},
    {t:"8:30 PM",n:"ðµ Fado â Mesa de Frades",p:[0,0,0,1,1],from:"A",src:1,par:true,d:"Tiny former chapel. Good Friday fado = once-in-a-lifetime. Book via concierge. Very small â book early.",mapQ:"Mesa+de+Frades+Alfama+Lisbon",links:[{t:"Mesa de Frades",u:"https://maps.google.com/?q=Mesa+de+Frades+Alfama+Lisbon"}]},
  ]},
  {date:"Fri, Apr 3",n:7,title:"Oceanarium, Alfama & Fado",iso:"2026-04-03",hotel:"lis",free:6,note:"â ï¸ Good Friday â"national holiday",prep:"Charge phone fully â heavy photo day. Metro passes for all. Comfortable shoes for Alfama cobblestones.",locs:[{w:[1,1,1,1,1],l:"lis"}],acts:[
    {t:"10:00 AM",n:"ð Oceanarium",p:[1,1,1,1,1],from:"A",src:1,booked:true,d:"â BOOKED â Ref #96455533. 10:00 AM entry, Fri Apr 3.\n\nTHE must-do for Rose. 15,000+ marine animals. Metro to Oriente (Calatrava station). Allow 2+ hours.\n\nð +351 218 917 000 Â· info@oceanario.pt",phone:"+351218917000",cancel:"24h",mapQ:"OceanÃ¡rio+de+Lisboa",links:[{t:"Oceanarium",u:"https://www.oceanario.pt"}]},
    {t:"~11:30",n:"ð¡ Cable car",p:[1,1,1,1,1],d:"TelefÃ©rico over the Tagus. Thrilling for kids. Playgrounds + promenades nearby."},
    {t:"1:00 PM",n:"ð´ Lunch & nap",p:[1,1,1,0,0],par:true,d:"Back to hotel. Rose needs rest before Alfama. Critical recharge."},
    {t:"1:00 PM",n:"ðï¸ Chiado free time",p:[0,0,0,1,1],par:true,d:"Christina + Jim explore: Bertrand (world's oldest bookshop, 1732), Carmo Convent (roofless 1755 church â architecturally haunting), Manteigaria pastÃ©is de nata. All 5-min walk from hotel.",mapQ:"Carmo+Convent+Lisbon",links:[{t:"Carmo Convent",u:"https://maps.google.com/?q=Carmo+Convent+Lisbon"}]},
    {t:"~4:30",n:"ð° Alfama + Castle",p:[1,1,1,1,1],d:"Tile streets, peacocks, ramparts, Children's Centre. Ginjinha for adults.",mapQ:"Castelo+SÃ£o+Jorge+Lisbon",links:[{t:"Castelo",u:"https://maps.google.com/?q=Castelo+SÃ£o+Jorge+Lisbon"}]},
    {t:"7:00 PM",n:"ð½ï¸ Early dinner",p:[1,1,1,0,0],par:true,d:"Family eats early. Rose to bed. Quiet evening."},
    {t:"8:30 PM",n:"ðµ Fado â Mesa de Frades",p:[0,0,0,1,1],from:"A",src:1,par:true,d:"Tiny former chapel. Good Friday fado = once-in-a-lifetime. Book via concierge. Very small â book early.",mapQ:"Mesa+de+Frades+Alfama+Lisbon",links:[{t:"Mesa de Frades",u:"https://maps.google.com/?q=Mesa+de+Frades+Alfama+Lisbon"}]},
  ]},
  {date:"Sat, Apr 4",n:8,title:"Slow Lisbon farewell",iso:"2026-04-04",hotel:"lis",free:5,prep:"Last full day. No tickets needed â just walk and eat.",locs:[{w:[1,1,1,1,1],l:"lis"}],acts:[
    {t:"~9:30",n:"ð³ Jardim da Estrela",p:[1,1,1,1,1],d:"Playground, duck ponds, bandstand, peacocks. CafÃ© under jacaranda trees.",mapQ:"Jardim+da+Estrela+Lisbon",links:[{t:"Visit Lisboa",u:"http://www.visitlisboa.com/en/places/jardim-da-estrela"}]},
    {t:"~10:30",n:"âª BasÃ­lica da Estrela",p:[1,1,1,1,1],d:"Baroque dome across from park. Gentle staircase to rooftop â 360Â° views. Rose might enjoy it as adventure.",mapQ:"BasÃ­lica+da+Estrela+Lisbon"},
    {t:"~11:00",n:"ð¨ Optional: Tile workshop",p:[1,1,1,1,1],from:"A",src:1,d:"Paint azulejo tiles â creative bookend to Barrocal crafts. Rose takes home a Portuguese souvenir. Little Lisbon family workshop or Cristina Cabrita (BelÃ©m). Or skip and wander.",cancel:"24h",links:[{t:"Little Lisbon tiles",u:"https://www.lisbonforkids.com/tiles-workshop"}]},
    {t:"~12:00",n:"ð½ï¸ Mercado de Campo de Ourique",p:[1,1,1,1,1],d:"10-min walk following tram tracks. Local Time Out Market â smaller, authentic. Wine, grilled seafood, nata.\n\nThe last meal. No clock. Rose stealing pastries. 8 unforgettable days. ðµð¹",mapQ:"Mercado+de+Campo+de+Ourique+Lisbon",links:[{t:"Campo de Ourique",u:"https://www.lisbonportugaltourism.com/guide/campo-de-ourique.html"}]},
  ]},
  {date:"Sun, Apr 5",n:9,title:"Departure â LIS â EWR â Home",iso:"2026-04-05",hotel:"fly",free:0,prep:"Early alarm. Pack tonight. Confirm Amtrak tickets. Car seat for Rose in airport van.",locs:[{w:[1,1,1,1,1],l:"fly"}],acts:[
    {t:"7:00 AM",n:"Breakfast + pack",p:[1,1,1,1,1],d:"Early breakfast. Check out by 7:45 AM. Flight 10:25 AM â arrive LIS by 8:15."},
    {t:"~7:45 AM",n:"ð Hotel â LIS airport",p:[1,1,1,1,1],from:"A",src:1,d:"Van for 5 + luggage. Car seat for Rose. 15 min ride.",mapQ:"Lisbon+Airport+LIS",links:[{t:"ZoneTransfers",u:"https://www.zonetransfers.com/airport-transfers/lisbon/"}]},
    {t:"10:25 AM",n:"âï¸ UA 65 Â· LIS â EWR",p:[1,1,1,1,1],d:"787-10. Nonstop, 7h 45m. Arrives 1:10 PM local.\n\nâ¢ Andy/Nicole/Rose: Polaris â seats 8D, 8F, 8L\nâ¢ Christina/Jim: Economy â seats 20J, 20L\n\nConf: IMH4SG (family) Â· GZDXFX (grandparents)"},
    {t:"1:10 PM",n:"ðºð¸ Arrive EWR + customs",p:[1,1,1,1,1],d:"Clear customs together. Global Entry â automated kiosks.\n\nâ ï¸ Split here:\nâ¢ Christina + Jim â stay airside for EWRâDCA (only ~1h50m â tight if customs slow)\nâ¢ Andy + Nicole + Rose â collect bags, head to train"},
    {t:"2:27 PM",n:"ð Amtrak NE Regional Â· EWR â WAS",p:[1,1,1,0,0],from:"A",src:1,booked:true,d:"â BOOKED â Reservation #C1A70D, Ticket #0830605529437.\n\nTrain 161, Sun Apr 5, 2:27 PM â 5:33 PM (3h 6m). EWR â WAS. 3 Business Class â Seats 10A, 10C, 10D. Passengers: Andrew Brown, Nicole Jones, Rose Jonesbrown.\n\nBoard directly at EWR airport Amtrak station. Tight connection from 1:10 PM landing â if customs is slow, reschedule to 3:26 PM train (no change fees).\n\nð Amtrak: 1-800-USA-RAIL (1-800-872-7245)",phone:"18008727245",mapQ:"Newark+Liberty+International+Airport+Amtrak",links:[{t:"Amtrak",u:"https://www.amtrak.com/northeast-regional-train"}]},
    {t:"3:00 PM",n:"âï¸ UA 4486 Â· EWR â DCA",p:[0,0,0,1,1],d:"Economy Plus â 7A, 7B. 1h 24m. Arrives DCA 4:24 PM.\n\nâ DCAcar BOOKED â Trip #P796J7. Meet & Greet at baggage claim, 4:24 PM. Executive sedan. $360.70 total (both legs combined). Flight tracking included. Free cancel up to 4h prior.\n\nð (240) 477-9877 Â· info@dcacar.com. Conf: GZDXFX",phone:"2404779877",mapQ:"Reagan+National+Airport+DCA",links:[{t:"DCAcar",u:"https://dcacar.ridebitsapp.com/central/new_reservation"}]},
    {t:"~5:33 PM",n:"ð  Home",p:[1,1,1,0,0],d:"Arrive Union Station ~5:33 PM (or ~6:28 PM if on backup 3:26 train). Uber home. Rose to bed. Pour a glass of Alentejo wine from the Barrocal boutique.\n\nBoa viagem! ðµð¹"},
  ]},
];

// ââ COMPONENTS ââ
function Dots({p}){return <span style={{display:"inline-flex",gap:2}}>{p.map((on,i)=>on?<span key={i} style={{width:16,height:16,borderRadius:8,backgroundColor:PC[i],display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:"white"}}>{INI[i]}</span>:null)}</span>}

function Links({links}){if(!links?.length)return null;return <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:8}}>{links.map((lk,i)=><a key={i} href={lk.u} target="_blank" rel="noopener noreferrer" style={{fontSize:10,fontWeight:600,color:DB,background:"white",border:`1px solid ${DB}33`,borderRadius:6,padding:"3px 8px",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:3}}>{lk.t} <span style={{fontSize:8,opacity:0.4}}>â</span></a>)}</div>}

function RichText({text}){
  const parts=text.split(/((?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3}[\s.-]?\d{2,4}\d*)/g);
  return <>{parts.map((part,i)=>{
    const digits=part.replace(/\D/g,"");
    if(digits.length>=9&&/\d{3}/.test(part)){
      const tel=digits.startsWith("351")?"+"+digits:digits;
      return <a key={i} href={`tel:${tel}`} style={{color:DB,textDecoration:"underline",fontWeight:600}}>{part}</a>;
    }
    return <span key={i}>{part}</span>;
  })}</>;
}

function MapBtn({dayHotel,mapQ}){
  if(!mapQ)return null;
  const origin=HOTELS[dayHotel]?.q||"";
  const url=origin?`https://www.google.com/maps/dir/${origin}/${mapQ}`:`https://www.google.com/maps/search/${mapQ}`;
  return <a href={url} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{flexShrink:0,width:28,height:28,borderRadius:14,background:"#E6F3F0",display:"inline-flex",alignItems:"center",justifyContent:"center",textDecoration:"none",fontSize:14,border:`1px solid ${GR}44`}} title="Directions">ð</a>;
}

function CalAct({a,dayHotel}){
  const[open,setOpen]=useState(false);const s=a.loc?LS[a.loc]:null;
  return <div style={{borderBottom:"1px solid #f5f5f5",background:s?s.bg+"44":"white"}}>
    <div onClick={()=>a.d&&setOpen(!open)} style={{padding:"8px 14px",cursor:a.d?"pointer":"default",display:"flex",gap:6,alignItems:"flex-start"}}>
      <div style={{width:54,flexShrink:0,fontSize:11,fontWeight:700,color:WG,paddingTop:2}}>{a.t}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
          <span style={{fontWeight:600,fontSize:13,color:DB}}>{a.n}</span>
          {a.par&&<span style={{fontSize:9,fontWeight:700,color:"#996633",background:"#FFF3E0",borderRadius:4,padding:"1px 5px"}}>â</span>}
        </div>
        <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:3,alignItems:"center"}}>
          <Dots p={a.p}/>
          {a.cost&&<span style={{fontSize:10,color:"#888",marginLeft:4}}>{a.cost}</span>}
          {a.conf&&<span style={{fontSize:9,fontFamily:"monospace",fontWeight:700,color:"#fff",background:"#444",borderRadius:4,padding:"1px 6px",marginLeft:2,letterSpacing:0.5}}>#{a.conf}</span>}
          {a.from==="B"&&<span style={{fontSize:9,fontWeight:600,color:"#3D6B35",background:"#E8F0E4",border:"1px solid #B5D4A8",borderRadius:4,padding:"1px 6px",marginLeft:2}}>Barrocal</span>}
          {a.from==="A"&&<span style={{fontSize:9,fontWeight:600,color:DB,background:"#E6EEF5",border:"1px solid #B0C8E0",borderRadius:4,padding:"1px 6px",marginLeft:2}}>Andy</span>}
          {a.src&&<span style={{fontSize:9,fontWeight:600,color:a.booked?"#0F6E56":"#C49A3C",background:a.booked?"#E1F5EE":"#FFF8E1",borderRadius:4,padding:"1px 6px",marginLeft:2}}>{a.booked?"â booked":"book"}</span>}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,paddingTop:2}}>
        <MapBtn dayHotel={dayHotel} mapQ={a.mapQ}/>
        {a.d&&<div style={{fontSize:12,color:"#ccc",transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>â¼</div>}
      </div>
    </div>
    {open&&a.d&&<div style={{padding:"0 14px 10px 68px"}}>
      <div style={{fontSize:12,color:"#555",lineHeight:1.6,whiteSpace:"pre-line"}}><RichText text={a.d}/></div>
      {a.cancel&&<div style={{marginTop:8,fontSize:11,color:a.cancel==="same-day"?RD:"#888",display:"inline-flex",alignItems:"center",gap:4}}>
        {a.cancel==="same-day"?"â ï¸":"â°"} Cancel: {a.cancel==="same-day"?"same-day = 100% charge":`${a.cancel} before`}
      </div>}
      <Links links={a.links}/>
    </div>}
  </div>;
}

function BarItem({item}){
  const[open,setOpen]=useState(false);
  return <div style={{borderBottom:"1px solid #f0f0f0"}}>
    <div onClick={()=>setOpen(!open)} style={{padding:"10px 14px",cursor:"pointer",display:"flex",gap:8}}>
      <div style={{width:54,flexShrink:0,fontSize:11,fontWeight:700,color:WG,paddingTop:2}}>{item.time}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:4}}>
          <span style={{fontWeight:600,fontSyle={{fontSize:13,color:"#555",lineHeight:1.6}}>{item.note}</div></div>}
  </div>;
}

function LocBadge({loc,who}){const s=LS[loc];const l=LOC[loc];return <div style={{display:"inline-flex",alignItems:"center",gap:4,background:s.bg,border:`1px solid ${s.b}`,borderRadius:8,padding:"3px 8px",fontSize:11}}><span>{l.i}</span><span style={{fontWeight:600,color:s.c}}>{l.l}</span><span style={{display:"inline-flex",gap:2}}>{who.map((on,i)=>on?<span key={i} style={{width:14,height:14,borderRadius:7,backgroundColor:PC[i],display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:"white"}}>{INI[i]}</span>:null)}</span></div>}

function SOSPanel({show,onClose}){
  if(!show)return null;
  return <div style={{position:"fixed",inset:0,zIndex:100,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
    <div onClick={onClose} style={{flex:1,background:"rgba(0,0,0,0.4)"}}/>
    <div style={{background:"white",borderRadius:"20px 20px 0 0",padding:"20px 16px 32px",maxHeight:"70vh",overflow:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <span style={{fontSize:16,fontWeight:700,color:DB}}>ð Emergency & Contacts</span>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#999"}}>â</button>
      </div>
      {SOS.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #f0f0f0"}}>
        <div>
          <div style={{fontSize:13,fontWeight:600,color:DB}}>{s.label}</div>
          {s.note&&<div style={{fontSize:11,color:"#999"}}>{s.note}</div>}
        </div>
        <a href={`tel:${s.phone.replace(/\s/g,"")}`} style={{background:GR,color:"white",fontWeight:700,fontSize:11,borderRadius:8,padding:"6px 12px",textDecoration:"none",whiteSpace:"nowrap"}}>Call</a>
      </div>)}
      <div style={{marginTop:16,display:"flex",gap:8}}>
        <a href="https://www.google.com/maps/search/farmÃ¡cia+near+me" target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",padding:"10px",background:"#F0FAF5",borderRadius:10,textDecoration:"none",fontSize:12,fontWeight:600,color:GR,border:`1px solid ${GR}33`}}>ð Nearest Pharmacy</a>
        <a href="https://www.google.com/maps/search/hospital+urgÃªncias+near+me" target="_blank" rel="noopener noreferrer" style={{flex:1,textAlign:"center",padding:"10px",background:"#FFF3E0",borderRadius:10,textDecoration:"none",fontSize:12,fontWeight:600,color:AM,border:`1px solid ${AM}33`}}>ð Nearest Hospital</a>
      </div>
    </div>
  </div>;
}

function TodoItem({item}){
  const[open,setOpen]=useState(false);
  const[done,setDone]=useState(item.done);
  const catColors={red:{bg:"#FEE2E2",border:"#FCA5A5",check:"#DC2626"},yellow:{bg:"#FEF9C3",border:"#FDE047",check:"#CA8A04"},orange:{bg:"#FFEDD5",border:"#FDBA74",check:"#EA580C"}};
  return <div style={{borderBottom:"1px solid #f0f0f0",opacity:done?0.5:1,transition:"opacity 0.2s"}}>
    <div style={{padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
      <button onClick={()=>setDone(!done)} style={{flexShrink:0,width:22,height:22,borderRadius:6,border:`2px solid ${done?"#10B981":"#D1D5DB"}`,background:done?"#10B981":"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginTop:1,transition:"all 0.2s"}}>
        {done&&<span style={{color:"white",fontSize:12,fontWeight:700}}>â</span>}
      </button>
      <div style={{flex:1,minWidth:0}} onClick={()=>item.detail&&setOpen(!open)}>
        <div style={{fontSize:13,fontWeight:600,color:done?"#999":DB,textDecoration:done?"line-through":"none",cursor:item.detail?"pointer":"default"}}>{item.text}</div>
      </div>
      {item.detail&&<div onClick={()=>setOpen(!open)} style={{flexShrink:0,fontSize:12,color:"#ccc",cursor:"pointer",paddingTop:4,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)"}}>â¼</div>}
    </div>
    {open&&item.detail&&<div style={{padding:"0 14px 10px 46px"}}>
      <div style={{fontSize:12,color:"#555",lineHeight:1.6,whiteSpace:"pre-line"}}>{item.detail}</div>
      {item.link&&<a href={item.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:11,fontWeight:600,color:DB,background:"white",border:`1px solid ${DB}33`,borderRadius:6,padding:"4px 10px",textDecoration:"none"}}>{item.linkLabel||"Open"} â</a>}
    </div>}
  </div>;
}

// ââ APP ââ
export default function App(){
  const[tab,setTab]=useState("calendar");
  const[sos,setSos]=useState(false);
  const[wx,setWx]=useState(null);
  const[wxLoading,setWxLoading]=useState(false);
  const todayRef=useRef(null);

  const today=new Date().toISOString().slice(0,10);
  const todayIdx=CAL.findIndex(d=>d.iso===today);
  const isTripTime=today<="2026-03-27"&&today<="2026-04-05";
  const wxLoc=today<="2026-04-01"?"Monsaraz, Alentejo":"Lisbon";

  useEffect(()=>{
    if(todayRef.current&&isTripTime) setTimeout(()=>todayRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),400);
  },[]);

  async function fetchWx(){
    setWxLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:`Current weather for ${wxLoc}, Portugal. Respond ONLY with valid JSON, no markdown backticks: {"temp_c":N,"condition":"...","high_c":N,"low_c":N}`}]})});
      const data=await res.json();
      const text=data.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      setWx(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(e){setWx({error:true});}
    setWxLoading(false);
  }

  return <div style={{minHeight:"100vh",background:"#F5F3EE",fontFamily:"system-ui,-apple-system,sans-serif",maxWidth:540,margin:"0 auto"}}>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet"/>

    {/* HEADER */}
    <div style={{background:`linear-gradient(135deg,${DB} 0%,#2C5F8A 100%)`,padding:"16px 16px 6px",position:"sticky",top:0,zIndex:20,boxShadow:"0 2px 8px rgba(0,0,0,0.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:11,fontWeight:600,letterSpacing:3,color:WG}}>PORTUGAL 2026</div>
          <div style={{color:"white",fontWeight:700,fontSize:18,marginTop:1}}>Trip Companion</div>
        </div>
        <div style={{textAlign:"right"}}>
          {wx&&!wx.error?<div style={{color:"white",fontSize:12}}>{wx.condition} {wx.temp_c}Â°C <span style={{opacity:0.5,fontSize:10}}>H{wx.high_c} L{wx.low_c}</span></div>
          :wxLoading?<div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Loadingâ¦</div>
          :<button onClick={fetchWx} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:6,color:"rgba(255,255,255,0.6)",fontSize:10,padding:"3px 8px",cursor:"pointer"}}>âï¸ Weather</button>}
          {wx&&!wx.error&&<button onClick={fetchWx} style={{background:"none",border:"none",color:"rgba(255,255,255,0.3)",fontSize:10,cursor:"pointer",marginTop:2}}>â» refresh</button>}
        </div>
      </div>
      <div style={{color:"rgba(255,255,255,0.4)",fontSize:10,marginTop:3}}>Mar 27 â Apr 5 Â· Tap any row for details</div>
      <div style={{display:"flex",marginTop:8,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
        {[{id:"calendar",l:"ð Calendar"},{id:"barrocal",l:"ð¿ Barrocal"},{id:"todo",l:"ð To-Do"}].map(t=>
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"8px 0",fontSize:12,fontWeight:tab===t.id?700:400,color:tab===t.id?WG:"rgba(255,255,255,0.45)",background:"none",border:"none",borderBottom:tab===t.id?`2px solid ${WG}`:"2px solid transparent",cursor:"pointer"}}>{t.l}</button>
        )}
      </div>
    </div>

    {/* CONTENT */}
    <div style={{padding:"10px 10px 80px"}}>

      {tab==="calendar"&&<>
        {/* People legend */}
        <div style={{background:"white",borderRadius:10,padding:"8px 12px",marginBottom:6,boxShadow:"0 1px 3px rgba(0,0,0,0.05)",display:"flex",flexWrap:"wrap",gap:4,alignItems:"center",fontSize:11}}>
          {["A=Andy","N=Nicole","R=Rose","C=Christina","J=Jim"].map((p,i)=><span key={i} style={{fontWeight:700,color:"white",borderRadius:10,padding:"2px 7px",backgroundColor:PC[i]}}>{p}</span>)}
        </div>
        {/* Day cards */}
        {CAL.map((day,di)=>{
          const isToday=day.iso===today;
          return <div key={di} id={`day-${di}`} ref={isToday?todayRef:null} style={{marginBottom:8,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",background:"white",borderLeft:isToday?`4px solid ${WG}`:"none"}}>
            <div style={{padding:"10px 12px",background:isToday?`linear-gradient(135deg,${DB},#3D7AB5)`:DB}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <span style={{fontSize:11,fontWeight:700,color:"white",background:"rgba(255,255,255,0.2)",borderRadius:4,padding:"2px 6px"}}>{day.n===0?"âï¸":`Day ${day.n}`}</span>
                <span style={{fontSize:11,color:WG}}>{day.date}</span>
                <span style={{marginLeft:"auto",display:"flex",gap:4,alignItems:"center"}}>
                  {isToday&&<span style={{fontSize:9,fontWeight:700,color:DB,background:WG,borderRadius:4,padding:"1px 6px"}}>TODAY</span>}
                  {day.free>0&&<span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.8)",background:"rgba(255,255,255,0.12)",borderRadius:4,padding:"2px 6px"}}>{day.free%1===0?day.free:day.free.toFixed(1)}h free</span>}
                </span>
              </div>
              <div style={{color:"white",fontWeight:700,fontSize:15,marginTop:2}}>{day.title}</div>
            </div>
            {day.note&&<div style={{padding:"4px 12px",fontSize:11,fontWeight:600,background:AM_BG,color:AM}}>{day.note}</div>}
            {day.prep&&<div style={{padding:"5px 12px",fontSize:10,color:"#888",background:"#FAFAF8",borderBottom:"1px solid #f0f0f0"}}>ð {day.prep}</div>}
            <div style={{padding:"6px 12px",display:"flex",flexWrap:"wrap",gap:4,borderBottom:"1px solid #f0f0f0"}}>
              {day.locs.map((lb,li)=><LocBadge key={li} loc={lb.l} who={lb.w}/>)}
            </div>
            {day.acts.map((a,ai)=><CalAct key={ai} a={a} dayHotel={day.hotel}/>)}
          </div>;
        })}
        {/* Daily average */}
        <div style={{background:"white",borderRadius:12,padding:"14px 16px",marginTop:4,boxShadow:"0 1px 4px rgba(0,0,0,0.06)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:12,fontWeight:700,color:DB}}>Daily average free time</div>
            <div style={{fontSize:10,color:"#999",marginTop:2}}>Parks, meals, wandering, pool, naps â anything unbooked</div>
          </div>
          <div style={{fontSize:20,fontWeight:700,color:WG}}>{(CAL.reduce((a,d)=>a+d.free,0)/CAL.length).toFixed(1)}h</div>
        </div>
      </>}

      {tab==="barrocal"&&<>
        <div style={{background:"white",borderRadius:10,padding:"12px 14px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:DB}}>Barrocal on-estate activities</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>From their proposal to the Brown family.</div>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:8}}>
            {PEOPLE.map((p,i)=><span key={i} style={{fontSize:11,fontWeight:700,color:"white",borderRadius:10,padding:"2px 8px",backgroundColor:PC[i]}}>{p}</span>)}
          </div>
        </div>
        {BDAYS.map((day,di)=><div key={di} style={{marginBottom:8,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",background:"white"}}>
          <div style={{padding:"10px 14px",background:DB}}>
            <div style={{fontSize:11,color:WG,fontWeight:600}}>{day.day}</div>
            <div style={{color:"white",fontWeight:700,fontSize:14,marginTop:1}}>{day.label}</div>
          </div>
          {day.sub&&<div style={{padding:"4px 14px",fontSize:11,fontWeight:600,background:AM_BG,color:AM}}>{day.sub}</div>}
          {day.items.map((item,i)=><BarItem key={i} item={item}/>)}
        </div>)}
        <div style={{background:GR_BG,borderRadius:14,padding:14,marginTop:8,borderLeft:`3px solid ${GR}`}}>
          <div style={{fontSize:12,fontWeight:700,color:GR,marginBottom:4}}>Still pending</div>
          <div style={{fontSize:12,color:"#666",lineHeight:1.7,whiteSpace:"pre-line"}}>{"1. Ãvora guide â Carolina checking availability\n2. Honey tasting â OPTIONAL, decide on arrival\n3. Wed dinner â choose Monte Mar or MarÃ© (tell JosÃ©)\n4. Portuguese For a Day â ask JosÃ© (draft ready)"}</div>
        </div>
      </>}

      {tab==="todo"&&<>
        <div style={{background:"white",borderRadius:10,padding:"12px 14px",marginBottom:10,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:13,fontWeight:700,color:DB}}>Trip to-do list</div>
          <div style={{fontSize:12,color:"#888",marginTop:2}}>3 days until departure Â· Tap checkboxes to mark done</div>
        </div>
        {TODOS.map((cat,ci)=><div key={ci} style={{marginBottom:10,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.06)",background:"white"}}>
          <div style={{padding:"10px 14px",background:cat.cat==="red"?"#DC2626":cat.cat==="yellow"?"#CA8A04":"#EA580C"}}>
            <div style={{color:"white",fontWeight:700,fontSize:13}}>{cat.label}</div>
          </div>
          {cat.items.map(item=><TodoItem key={item.id} item={item}/>)}
        </div>)}
      </>}
    </div>

    {/* FLOATING BUTTONS */}
    {isTripTime&&todayIdx>=0&&<button onClick={()=>todayRef.current?.scrollIntoView({behavior:"smooth",block:"start"})} style={{position:"fixed",bottom:20,left:16,background:DB,color:"white",border:"none",borderRadius:20,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.2)",zIndex:30}}>Today â</button>}
    <button onClick={()=>setSos(true)} style={{position:"fixed",bottom:20,right:16,width:48,height:48,borderRadius:24,background:"#D50032",color:"white",border:"none",fontSize:20,cursor:"pointer",boxShadow:"0 2px 10px rgba(213,0,50,0.3)",zIndex:30,display:"flex",alignItems:"center",justifyContent:"center"}}>ð</button>
    <SOSPanel show={sos} onClose={()=>setSos(false)}/>
  </div>;
}
