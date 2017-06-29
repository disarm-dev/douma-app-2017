var faker = require('faker')

const areas = [
  {
    "category": "Lubombo",
    "id": "346000_347000_348000_413000_414000_415000",
    "name": "Siteki (Dvokodvweni)"
  },
  {
    "category": "Manzini",
    "id": "67000",
    "name": "Bhunya (Mhlambanyatsi)"
  },
  {
    "category": "Manzini",
    "id": "56000",
    "name": "Bhunya (Lamgabhi)"
  },
  {
    "category": "Hhohho",
    "id": "193000",
    "name": "Hhelehhele (Ntfonjeni)"
  },
  {
    "category": "Manzini",
    "id": "96000_97000",
    "name": "Mpuluzi (Mangcongco)"
  },
  {
    "category": "Manzini",
    "id": "449000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Manzini",
    "id": "35000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Manzini",
    "id": "19000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Manzini",
    "id": "52000",
    "name": "Luyengo (Mahlanya)"
  },
  {
    "category": "Manzini",
    "id": "93000",
    "name": "Lundzi (Mhlambanyatsi)"
  },
  {
    "category": "Manzini",
    "id": "66000",
    "name": "Dwalile (Nhlambeni)"
  },
  {
    "category": "Hhohho",
    "id": "159000_160000",
    "name": "Tonkwane (Mbabane)"
  },
  {
    "category": "Shiselweni",
    "id": "247000_507000",
    "name": "Ekwendzeni (Mtsambama)"
  },
  {
    "category": "Hhohho",
    "id": "153000_154000_155000",
    "name": "Siphocosini (Mbabane)"
  },
  {
    "category": "Lubombo",
    "id": "435000",
    "name": "Mpaka (Dvokodvweni)"
  },
  {
    "category": "Lubombo",
    "id": "368000",
    "name": "Maphungwane (Tikhuba)"
  },
  {
    "category": "Shiselweni",
    "id": "379000_380000",
    "name": "Mantambe (Hosea)"
  },
  {
    "category": "Shiselweni",
    "id": "235000",
    "name": "Magubheleni (Gege)"
  },
  {
    "category": "Shiselweni",
    "id": "301000_302000_303000",
    "name": "Ezindwendweni (Sigwe)"
  },
  {
    "category": "Hhohho",
    "id": "161000_162000",
    "name": "Nkhaba (Nkaba)"
  },
  {
    "category": "Hhohho",
    "id": "170000",
    "name": "Maphalaleni (Maphalaleni)"
  },
  {
    "category": "Manzini",
    "id": "121000",
    "name": "Dvokolwako (Mkhiweni)"
  },
  {
    "category": "Shiselweni",
    "id": "458000",
    "name": "Mbangweni (Mbangweni)"
  },
  {
    "category": "Manzini",
    "id": "83000_84000",
    "name": "Dvudvusini (Ngwempisi)"
  },
  {
    "category": "Lubombo",
    "id": "416000",
    "name": "Shewula (Lomahasha)"
  },
  {
    "category": "Manzini",
    "id": "72000_73000_74000",
    "name": "Buseleni (Mahlangatja)"
  },
  {
    "category": "Lubombo",
    "id": "412000",
    "name": "Ngcina (Mpolonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "304000",
    "name": "Ntjanini (Ngudzeni)"
  },
  {
    "category": "Hhohho",
    "id": "173000",
    "name": "Ndzingeni (Ndzingeni)"
  },
  {
    "category": "Shiselweni",
    "id": "339000",
    "name": "Ka-Phunga (Kubuta)"
  },
  {
    "category": "Manzini",
    "id": "133000_134000",
    "name": "Ka-Kholwane (Mahlangatja)"
  },
  {
    "category": "Lubombo",
    "id": "450000_451000",
    "name": "Nqandweni (Sithobela)"
  },
  {
    "category": "Lubombo",
    "id": "345000",
    "name": "Sitsatsaweni (Mbangweni)"
  },
  {
    "category": "Lubombo",
    "id": "417000",
    "name": "Shewula (Lomahasha)"
  },
  {
    "category": "Lubombo",
    "id": "410000_411000",
    "name": "Tambuti (Siphofaneni)"
  },
  {
    "category": "Lubombo",
    "id": "430000",
    "name": "Dvokolwako (Mhlume)"
  },
  {
    "category": "Shiselweni",
    "id": "14000_244000",
    "name": "Mahamba (Maseyisini)"
  },
  {
    "category": "Lubombo",
    "id": "437000",
    "name": "Lomahasha (Lomahasha)"
  },
  {
    "category": "Manzini",
    "id": "59000",
    "name": "Ntondozi (Ntondozi)"
  },
  {
    "category": "Lubombo",
    "id": "429000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Shiselweni",
    "id": "263000_265000_264000_266000",
    "name": "Magele (Mtsambama)"
  },
  {
    "category": "Hhohho",
    "id": "499000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "77000",
    "name": "Mankayane (Ngwempisi)"
  },
  {
    "category": "Hhohho",
    "id": "226000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "136000",
    "name": "Mpisi Farm (Mkhiweni)"
  },
  {
    "category": "Hhohho",
    "id": "223000",
    "name": "Lobamba (Lobamba)"
  },
  {
    "category": "Manzini",
    "id": "65000",
    "name": "Dwalile (Mangcongco)"
  },
  {
    "category": "Shiselweni",
    "id": "8000_267000_268000_269000_270000_271000",
    "name": "Mahlalini (Mbangweni)"
  },
  {
    "category": "Hhohho",
    "id": "10000_151000_152000",
    "name": "Komati (Pigg'S PEAK)"
  },
  {
    "category": "Manzini",
    "id": "259000_517000",
    "name": "Bhekinkosi (Kukhanyeni)"
  },
  {
    "category": "Lubombo",
    "id": "418000",
    "name": "Tabankulu (Mhlume)"
  },
  {
    "category": "Manzini",
    "id": "117000",
    "name": "Nkiliji (Kukhanyeni)"
  },
  {
    "category": "Manzini",
    "id": "36000_37000",
    "name": "Matsapha (Manzini)"
  },
  {
    "category": "Hhohho",
    "id": "149000_150000",
    "name": "Mhlangatane (Mayiwane)"
  },
  {
    "category": "Manzini",
    "id": "49000",
    "name": "Malkerns (Mahlanya)"
  },
  {
    "category": "Manzini",
    "id": "28000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Hhohho",
    "id": "215000",
    "name": "Maphalaleni (Nsangwini)"
  },
  {
    "category": "Manzini",
    "id": "126000",
    "name": "Ngculwini (Mafutseni)"
  },
  {
    "category": "Manzini",
    "id": "91000_92000",
    "name": "Gundvwini (Mthongwaneni)"
  },
  {
    "category": "Shiselweni",
    "id": "386000",
    "name": "Buseleni (Nkwene)"
  },
  {
    "category": "Lubombo",
    "id": "481000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Lubombo",
    "id": "484000",
    "name": "Siphofaneni (Siphofaneni)"
  },
  {
    "category": "Manzini",
    "id": "85000",
    "name": "Nyakeni (Kukhanyeni)"
  },
  {
    "category": "Manzini",
    "id": "41000",
    "name": "Zombodze (Ludzeludze)"
  },
  {
    "category": "Shiselweni",
    "id": "333000",
    "name": "Makhosini (Maseyisini)"
  },
  {
    "category": "Hhohho",
    "id": "258000",
    "name": "Luhlendlweni (Motjane)"
  },
  {
    "category": "Shiselweni",
    "id": "396000_397000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Shiselweni",
    "id": "383000",
    "name": "Matsanjeni (Matsanjeni)"
  },
  {
    "category": "Hhohho",
    "id": "166000",
    "name": "Maphalaleni (Maphalaleni)"
  },
  {
    "category": "Manzini",
    "id": "115000",
    "name": "Ka-Khuphuka (Mkhiweni)"
  },
  {
    "category": "Hhohho",
    "id": "205000",
    "name": "Mshingishingini (Ntfonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "308000_309000",
    "name": "Mgamude (Hosea)"
  },
  {
    "category": "Hhohho",
    "id": "206000_207000_208000",
    "name": "Nyakatfo (Mayiwane)"
  },
  {
    "category": "Hhohho",
    "id": "192000",
    "name": "Herefords (Mayiwane)"
  },
  {
    "category": "Shiselweni",
    "id": "342000",
    "name": "Sandleni (Sandleni)"
  },
  {
    "category": "Lubombo",
    "id": "466000",
    "name": "Lukhetseni (Mpolonjeni)"
  },
  {
    "category": "Lubombo",
    "id": "490000_491000",
    "name": "Siphofaneni (Siphofaneni)"
  },
  {
    "category": "Shiselweni",
    "id": "310000",
    "name": "Qomintaba (Matsanjeni)"
  },
  {
    "category": "Manzini",
    "id": "447000",
    "name": "Mdojane (Lamgabhi)"
  },
  {
    "category": "Manzini",
    "id": "2000_46000_47000",
    "name": "Masundvwini (Nhlambeni)"
  },
  {
    "category": "Lubombo",
    "id": "402000",
    "name": "Ka-Shoba (Mpolonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "289000_290000_291000",
    "name": "Ka-Shiba (Sandleni)"
  },
  {
    "category": "Lubombo",
    "id": "436000",
    "name": "Lomahasha (Lomahasha)"
  },
  {
    "category": "Lubombo",
    "id": "409000",
    "name": "Siphofaneni (Siphofaneni)"
  },
  {
    "category": "Lubombo",
    "id": "495000",
    "name": "Ka-Phunga (Siphofaneni)"
  },
  {
    "category": "Lubombo",
    "id": "486000_487000_488000",
    "name": "Macetjeni (Siphofaneni)"
  },
  {
    "category": "Shiselweni",
    "id": "236000",
    "name": "Gege (Gege)"
  },
  {
    "category": "Manzini",
    "id": "50000",
    "name": "Sigombeni (Ludzeludze)"
  },
  {
    "category": "Shiselweni",
    "id": "387000",
    "name": "Ko-Ntjingila (Kubuta)"
  },
  {
    "category": "Lubombo",
    "id": "465000",
    "name": "Mambane (Tikhuba)"
  },
  {
    "category": "Lubombo",
    "id": "433000",
    "name": "Malindza (Hlane)"
  },
  {
    "category": "Hhohho",
    "id": "146000",
    "name": "Mhlangatane (Mhlangatane)"
  },
  {
    "category": "Lubombo",
    "id": "365000",
    "name": "Tikhuba (Tikhuba)"
  },
  {
    "category": "Shiselweni",
    "id": "13000_340000_509000_511000_513000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Shiselweni",
    "id": "273000_274000_275000",
    "name": "Shiselweni Forest (Gege)"
  },
  {
    "category": "Manzini",
    "id": "57000",
    "name": "Ntondozi (Ntondozi)"
  },
  {
    "category": "Manzini",
    "id": "445000_448000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Shiselweni",
    "id": "457000",
    "name": "Gege (Gege)"
  },
  {
    "category": "Manzini",
    "id": "23000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Hhohho",
    "id": "211000",
    "name": "Sihhoye (Mhlangatane)"
  },
  {
    "category": "Lubombo",
    "id": "439000",
    "name": "Lomahasha (Lomahasha)"
  },
  {
    "category": "Shiselweni",
    "id": "375000",
    "name": "Lucolweni (Hosea)"
  },
  {
    "category": "Hhohho",
    "id": "9000_196000",
    "name": "Nkamazi (Ndzingeni)"
  },
  {
    "category": "Lubombo",
    "id": "364000",
    "name": "Maphungwane (Tikhuba)"
  },
  {
    "category": "Manzini",
    "id": "75000_76000",
    "name": "Mhlambanyatsi (Mhlambanyatsi)"
  },
  {
    "category": "Lubombo",
    "id": "477000_478000_479000",
    "name": "Big- Bend (Sithobela)"
  },
  {
    "category": "Hhohho",
    "id": "202000",
    "name": "Ntfonjeni (Ntfonjeni)"
  },
  {
    "category": "Manzini",
    "id": "122000_123000_124000",
    "name": "Nsenga (Maphalaleni)"
  },
  {
    "category": "Shiselweni",
    "id": "239000",
    "name": "Mahamba (Maseyisini)"
  },
  {
    "category": "Shiselweni",
    "id": "401000",
    "name": "Hluti (Hosea)"
  },
  {
    "category": "Hhohho",
    "id": "217000",
    "name": "Nsingweni (Maphalaleni)"
  },
  {
    "category": "Hhohho",
    "id": "178000",
    "name": "Phophonyane (Ntfonjeni)"
  },
  {
    "category": "Hhohho",
    "id": "7000_11000_256000",
    "name": "Luhlangotsini (Mhlangatane)"
  },
  {
    "category": "Shiselweni",
    "id": "337000",
    "name": "Ka-Phunga (Kubuta)"
  },
  {
    "category": "Lubombo",
    "id": "428000",
    "name": "Ngomane (Mhlume)"
  },
  {
    "category": "Shiselweni",
    "id": "230000_320000_321000",
    "name": "Mgazini (Gege)"
  },
  {
    "category": "Hhohho",
    "id": "195000",
    "name": "Herefords (Mayiwane)"
  },
  {
    "category": "Shiselweni",
    "id": "370000_371000",
    "name": "Ngololweni (Sandleni)"
  },
  {
    "category": "Shiselweni",
    "id": "334000",
    "name": "Nhlangano (Mbangweni)"
  },
  {
    "category": "Shiselweni",
    "id": "384000_385000",
    "name": "Mgampondo (Matsanjeni)"
  },
  {
    "category": "Manzini",
    "id": "503000",
    "name": "Luyengo (Mahlanya)"
  },
  {
    "category": "Shiselweni",
    "id": "398000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Lubombo",
    "id": "485000",
    "name": "Sigcaweni (Mpolonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "296000_297000",
    "name": "Makhosini (Zombodze)"
  },
  {
    "category": "Hhohho",
    "id": "203000",
    "name": "KaLomshiyo (Ntfonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "332000",
    "name": "Nhlangano (Mbangweni)"
  },
  {
    "category": "Hhohho",
    "id": "188000_189000_190000",
    "name": "Emsahweni (Ntfonjeni)"
  },
  {
    "category": "Hhohho",
    "id": "197000",
    "name": "Mgobodzi (Ntfonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "233000",
    "name": "Mahlangatsha (Gege)"
  },
  {
    "category": "Manzini",
    "id": "88000_89000",
    "name": "Dwaleni (Mahlanya)"
  },
  {
    "category": "Manzini",
    "id": "30000_31000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Shiselweni",
    "id": "5000_298000_299000",
    "name": "Zombodze (Zombodze)"
  },
  {
    "category": "Manzini",
    "id": "26000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Lubombo",
    "id": "359000",
    "name": "Lubuli (Lubuli)"
  },
  {
    "category": "Shiselweni",
    "id": "272000",
    "name": "Ekwendzeni (Nkwene)"
  },
  {
    "category": "Hhohho",
    "id": "250000_251000",
    "name": "Ndlalambi (Timpisini)"
  },
  {
    "category": "Shiselweni",
    "id": "300000",
    "name": "Makhosini (Maseyisini)"
  },
  {
    "category": "Hhohho",
    "id": "221000",
    "name": "Lobamba (Lobamba)"
  },
  {
    "category": "Manzini",
    "id": "111000_112000",
    "name": "Bhekinkosi (Mbangweni)"
  },
  {
    "category": "Lubombo",
    "id": "423000",
    "name": "Hlane (Hlane)"
  },
  {
    "category": "Hhohho",
    "id": "500000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Lubombo",
    "id": "419000",
    "name": "Simunye (Mhlume)"
  },
  {
    "category": "Manzini",
    "id": "132000",
    "name": "Bulunga (Mthongwaneni)"
  },
  {
    "category": "Lubombo",
    "id": "483000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Hhohho",
    "id": "501000_518000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "38000",
    "name": "Masundvwini (Nhlambeni)"
  },
  {
    "category": "Manzini",
    "id": "110000",
    "name": "Mahlangatja (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "79000_80000_314000_315000",
    "name": "Bhunya (Mangcongco)"
  },
  {
    "category": "Lubombo",
    "id": "344000",
    "name": "Sitsatsaweni (Lugongolweni)"
  },
  {
    "category": "Hhohho",
    "id": "167000_168000_322000_323000",
    "name": "Dlangeni (Hhukwini)"
  },
  {
    "category": "Hhohho",
    "id": "191000",
    "name": "Herefords (Ntfonjeni)"
  },
  {
    "category": "Hhohho",
    "id": "174000",
    "name": "Bulembu (Nhlambeni)"
  },
  {
    "category": "Hhohho",
    "id": "212000",
    "name": "Madlangempisi (Madlangampisi)"
  },
  {
    "category": "Lubombo",
    "id": "358000",
    "name": "Lubuli (Lubuli)"
  },
  {
    "category": "Lubombo",
    "id": "357000",
    "name": "Ngwavuma (Lubuli)"
  },
  {
    "category": "Hhohho",
    "id": "163000",
    "name": "Mnyokane (Nkaba)"
  },
  {
    "category": "Lubombo",
    "id": "403000",
    "name": "Ka-Mkhweli (Siphofaneni)"
  },
  {
    "category": "Lubombo",
    "id": "425000",
    "name": "Tshaneni (Mhlume)"
  },
  {
    "category": "Hhohho",
    "id": "171000_172000",
    "name": "Nsangwini (Ndzingeni)"
  },
  {
    "category": "Manzini",
    "id": "82000",
    "name": "Makhungutsha (Mahlangatja)"
  },
  {
    "category": "Hhohho",
    "id": "1000_227000_324000_325000",
    "name": "Thurso Farm (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "29000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Shiselweni",
    "id": "338000",
    "name": "Lavumisa (Lavumisa)"
  },
  {
    "category": "Hhohho",
    "id": "179000_180000",
    "name": "Emvembili (Ntfonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "391000",
    "name": "Ngobolweni (Kubuta)"
  },
  {
    "category": "Manzini",
    "id": "119000",
    "name": "Luve (Mkhiweni)"
  },
  {
    "category": "Hhohho",
    "id": "497000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Shiselweni",
    "id": "293000_294000",
    "name": "Makhosini (Zombodze)"
  },
  {
    "category": "Hhohho",
    "id": "442000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "44000_45000",
    "name": "Ekudzeni (Maphalaleni)"
  },
  {
    "category": "Hhohho",
    "id": "220000",
    "name": "Ezulwini (Lobamba)"
  },
  {
    "category": "Shiselweni",
    "id": "399000",
    "name": "Hluti (Shiselweni 1)"
  },
  {
    "category": "Lubombo",
    "id": "440000",
    "name": "Lomahasha (Lomahasha)"
  },
  {
    "category": "Shiselweni",
    "id": "381000",
    "name": "Nsalitje (Matsanjeni)"
  },
  {
    "category": "Lubombo",
    "id": "404000_405000",
    "name": "Siteki (Dvokodvweni)"
  },
  {
    "category": "Shiselweni",
    "id": "343000_369000",
    "name": "Ngudzeni (Ngudzeni)"
  },
  {
    "category": "Hhohho",
    "id": "198000",
    "name": "Buhleni (Ndzingeni)"
  },
  {
    "category": "Lubombo",
    "id": "362000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Manzini",
    "id": "42000",
    "name": "Zombodze (Ludzeludze)"
  },
  {
    "category": "Hhohho",
    "id": "213000_214000",
    "name": "Bhalekane (Ndzingeni)"
  },
  {
    "category": "Hhohho",
    "id": "181000",
    "name": "Emvembili (Ntfonjeni)"
  },
  {
    "category": "Lubombo",
    "id": "472000",
    "name": "Lubuli (Lubuli)"
  },
  {
    "category": "Hhohho",
    "id": "199000",
    "name": "Bulandzeni (Zombodze)"
  },
  {
    "category": "Shiselweni",
    "id": "330000",
    "name": "Matsanjeni (Matsanjeni)"
  },
  {
    "category": "Manzini",
    "id": "71000",
    "name": "Malutha (Mangcongco)"
  },
  {
    "category": "Hhohho",
    "id": "147000_148000",
    "name": "Nkambeni (Mhlangatane)"
  },
  {
    "category": "Shiselweni",
    "id": "376000_377000",
    "name": "Ezikhotheni (Hosea)"
  },
  {
    "category": "Lubombo",
    "id": "424000",
    "name": "Mhlume (Mhlume)"
  },
  {
    "category": "Manzini",
    "id": "260000_261000_262000_311000_312000_313000",
    "name": "Nyakeni (Kukhanyeni)"
  },
  {
    "category": "Manzini",
    "id": "87000",
    "name": "Dwalile (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "108000",
    "name": "Ngwempisi (Ngwempisi)"
  },
  {
    "category": "Hhohho",
    "id": "169000",
    "name": "Mdzimba (Hhukwini)"
  },
  {
    "category": "Manzini",
    "id": "90000",
    "name": "Bhahwini (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "94000",
    "name": "Velezizweni (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "139000",
    "name": "Mafutseni (Mayiwane)"
  },
  {
    "category": "Lubombo",
    "id": "407000_408000",
    "name": "Ka-Langa (Dvokodvweni)"
  },
  {
    "category": "Hhohho",
    "id": "209000_210000",
    "name": "Nkambeni (Mhlangatane)"
  },
  {
    "category": "Lubombo",
    "id": "366000",
    "name": "Mambane (Tikhuba)"
  },
  {
    "category": "Manzini",
    "id": "105000_317000",
    "name": "Ngwempisi (Ngwempisi)"
  },
  {
    "category": "Hhohho",
    "id": "219000",
    "name": "Langeni (Lobamba)"
  },
  {
    "category": "Manzini",
    "id": "21000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Shiselweni",
    "id": "276000_277000_278000_279000",
    "name": "Nkungwini (Sandleni)"
  },
  {
    "category": "Hhohho",
    "id": "229000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "135000",
    "name": "Mhlangeni (Lamgabhi)"
  },
  {
    "category": "Hhohho",
    "id": "249000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Hhohho",
    "id": "194000",
    "name": "Herefords (Ndzingeni)"
  },
  {
    "category": "Manzini",
    "id": "60000",
    "name": "Gebeni (Ntondozi)"
  },
  {
    "category": "Lubombo",
    "id": "422000",
    "name": "Maphungwane (Tikhuba)"
  },
  {
    "category": "Manzini",
    "id": "141000_142000",
    "name": "Sidvokodvo (Mthongwaneni)"
  },
  {
    "category": "Shiselweni",
    "id": "382000",
    "name": "Lavumisa Town (Lavumisa)"
  },
  {
    "category": "Lubombo",
    "id": "350000_516000",
    "name": "Siteki (Lugongolweni)"
  },
  {
    "category": "Shiselweni",
    "id": "237000_238000",
    "name": "Mahlangatsha (Gege)"
  },
  {
    "category": "Manzini",
    "id": "116000",
    "name": "Ka-Khuphuka (Mkhiweni)"
  },
  {
    "category": "Manzini",
    "id": "55000",
    "name": "La-Mgabhi (Lamgabhi)"
  },
  {
    "category": "Manzini",
    "id": "86000",
    "name": "Dwalile (Mangcongco)"
  },
  {
    "category": "Shiselweni",
    "id": "372000_373000",
    "name": "Mooi-Hoek (Mtsambama)"
  },
  {
    "category": "Manzini",
    "id": "95000",
    "name": "Dvudvusini (Ngwempisi)"
  },
  {
    "category": "Hhohho",
    "id": "504000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Shiselweni",
    "id": "4000_243000",
    "name": "Mahamba (Mtsambama)"
  },
  {
    "category": "Hhohho",
    "id": "459000",
    "name": "Mpolonjeni (Motjane)"
  },
  {
    "category": "Lubombo",
    "id": "482000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Hhohho",
    "id": "54000",
    "name": "La-Mgabhi (Hhukwini)"
  },
  {
    "category": "Hhohho",
    "id": "502000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Lubombo",
    "id": "470000_471000",
    "name": "Sithobela (Sithobela)"
  },
  {
    "category": "Lubombo",
    "id": "360000_361000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Shiselweni",
    "id": "331000",
    "name": "Ka-Mbhoke (Mtsambama)"
  },
  {
    "category": "Shiselweni",
    "id": "280000",
    "name": "Madulini (Mbangweni)"
  },
  {
    "category": "Lubombo",
    "id": "355000",
    "name": "Siteki Town (Lugongolweni)"
  },
  {
    "category": "Manzini",
    "id": "24000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Shiselweni",
    "id": "400000",
    "name": "Hluti (Shiselweni 1)"
  },
  {
    "category": "Hhohho",
    "id": "200000_201000",
    "name": "Gucuka (Maphalaleni)"
  },
  {
    "category": "Lubombo",
    "id": "473000_474000",
    "name": "Ka-Ngcamphalala (Sithobela)"
  },
  {
    "category": "Manzini",
    "id": "62000",
    "name": "Ngwempisi (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "61000",
    "name": "Bhadzeni (Ngwempisi)"
  },
  {
    "category": "Shiselweni",
    "id": "341000",
    "name": "Mbelebeleni (Sandleni)"
  },
  {
    "category": "Shiselweni",
    "id": "393000_394000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Manzini",
    "id": "53000",
    "name": "Mahlanya (Mahlanya)"
  },
  {
    "category": "Hhohho",
    "id": "228000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Hhohho",
    "id": "175000",
    "name": "Nkhaba (Nkaba)"
  },
  {
    "category": "Hhohho",
    "id": "257000",
    "name": "Luhlangotsini (Pigg'S PEAK)"
  },
  {
    "category": "Lubombo",
    "id": "480000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Lubombo",
    "id": "492000",
    "name": "Nceka (Sithobela)"
  },
  {
    "category": "Manzini",
    "id": "98000",
    "name": "Bhahwini (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "127000",
    "name": "Ngculwini (Mthongwaneni)"
  },
  {
    "category": "Manzini",
    "id": "63000_64000_389000",
    "name": "Bhadzeni (Mangcongco)"
  },
  {
    "category": "Hhohho",
    "id": "443000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Shiselweni",
    "id": "378000",
    "name": "Zombodze (Zombodze)"
  },
  {
    "category": "Shiselweni",
    "id": "390000_512000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Manzini",
    "id": "15000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Manzini",
    "id": "101000",
    "name": "Sigcineni (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "99000_100000",
    "name": "Ngcoseni (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "20000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Hhohho",
    "id": "183000",
    "name": "Mashobeni (Timpisini)"
  },
  {
    "category": "Lubombo",
    "id": "468000",
    "name": "Maloma (Sithobela)"
  },
  {
    "category": "Manzini",
    "id": "128000",
    "name": "Ngculwini (Mafutseni)"
  },
  {
    "category": "Shiselweni",
    "id": "328000_329000",
    "name": "Mlindazwe (Matsanjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "281000_282000",
    "name": "Mbangweni (Mbangweni)"
  },
  {
    "category": "Manzini",
    "id": "106000",
    "name": "Mahlangatja (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "34000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Hhohho",
    "id": "444000",
    "name": "Pigg's Peak (Pigg'S PEAK)"
  },
  {
    "category": "Hhohho",
    "id": "222000",
    "name": "Ezulwini (Lobamba)"
  },
  {
    "category": "Shiselweni",
    "id": "246000",
    "name": "Mahamba (Maseyisini)"
  },
  {
    "category": "Shiselweni",
    "id": "246000",
    "name": "Mahamba (Maseyisini)"
  },
  {
    "category": "Shiselweni",
    "id": "185000_231000_232000_253000_254000",
    "name": "Ndlalambi (Mayiwane)"
  },
  {
    "category": "Hhohho",
    "id": "185000_231000_232000_253000_254000",
    "name": "Ndlalambi (Mayiwane)"
  },
  {
    "category": "Manzini",
    "id": "81000",
    "name": "Makhungutsha (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "81000",
    "name": "Makhungutsha (Ngwempisi)"
  },
  {
    "category": "Shiselweni",
    "id": "374000",
    "name": "Lucolweni (Sandleni)"
  },
  {
    "category": "Shiselweni",
    "id": "392000",
    "name": "Buseleni (Nkwene)"
  },
  {
    "category": "Shiselweni",
    "id": "374000",
    "name": "Lucolweni (Sandleni)"
  },
  {
    "category": "Lubombo",
    "id": "452000_460000_461000",
    "name": "Nqandweni (Lubuli)"
  },
  {
    "category": "Lubombo",
    "id": "452000_460000_461000",
    "name": "Nqandweni (Lubuli)"
  },
  {
    "category": "Hhohho",
    "id": "216000",
    "name": "Maphalaleni (Maphalaleni)"
  },
  {
    "category": "Hhohho",
    "id": "216000",
    "name": "Maphalaleni (Maphalaleni)"
  },
  {
    "category": "Lubombo",
    "id": "475000",
    "name": "Gucuka (Sithobela)"
  },
  {
    "category": "Lubombo",
    "id": "475000",
    "name": "Gucuka (Sithobela)"
  },
  {
    "category": "Shiselweni",
    "id": "388000_510000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Shiselweni",
    "id": "388000_510000",
    "name": "Ko-Ntjingila (Mtsambama)"
  },
  {
    "category": "Manzini",
    "id": "39000_40000_431000_432000",
    "name": "Elwandle (Mthongwaneni)"
  },
  {
    "category": "Hhohho",
    "id": "184000_186000_187000",
    "name": "Ndlalambi (Timpisini)"
  },
  {
    "category": "Lubombo",
    "id": "39000_40000_431000_432000",
    "name": "Malindza (Hlane)"
  },
  {
    "category": "Shiselweni",
    "id": "375000",
    "name": "Lucolweni (Hosea)"
  },
  {
    "category": "Shiselweni",
    "id": "375000",
    "name": "Lucolweni (Hosea)"
  },
  {
    "category": "Shiselweni",
    "id": "304000",
    "name": "Ntjanini (Ngudzeni)"
  },
  {
    "category": "Shiselweni",
    "id": "304000",
    "name": "Ntjanini (Ngudzeni)"
  },
  {
    "category": "Hhohho",
    "id": "218000",
    "name": "Ezulwini (Lobamba)"
  },
  {
    "category": "Hhohho",
    "id": "498000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "22000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Lubombo",
    "id": "426000_427000",
    "name": "Tshaneni (Mhlume)"
  },
  {
    "category": "Shiselweni",
    "id": "286000",
    "name": "Mhlosheni (Zombodze)"
  },
  {
    "category": "Hhohho",
    "id": "3000_176000",
    "name": "Mantjolo (Nkaba)"
  },
  {
    "category": "Shiselweni",
    "id": "234000",
    "name": "Mahlangatsha (Gege)"
  },
  {
    "category": "Manzini",
    "id": "78000",
    "name": "Mankayane (Mahlangatja)"
  },
  {
    "category": "Manzini",
    "id": "118000",
    "name": "Luve (Mkhiweni)"
  },
  {
    "category": "Manzini",
    "id": "131000",
    "name": "Ngculwini (Mthongwaneni)"
  },
  {
    "category": "Lubombo",
    "id": "496000",
    "name": "Sithobela (Sithobela)"
  },
  {
    "category": "Manzini",
    "id": "58000",
    "name": "Ka-Ndinda (Ntondozi)"
  },
  {
    "category": "Manzini",
    "id": "68000_69000",
    "name": "Maliyaduma (Kukhanyeni)"
  },
  {
    "category": "Lubombo",
    "id": "406000",
    "name": "Mpholonjeni (Mpolonjeni)"
  },
  {
    "category": "Shiselweni",
    "id": "283000_284000_285000",
    "name": "Mthombe (Sandleni)"
  },
  {
    "category": "Lubombo",
    "id": "441000",
    "name": "Tsambokhulu (Lomahasha)"
  },
  {
    "category": "Hhohho",
    "id": "145000",
    "name": "Motjane (Motjane)"
  },
  {
    "category": "Manzini",
    "id": "120000",
    "name": "Luve (Mkhiweni)"
  },
  {
    "category": "Lubombo",
    "id": "434000",
    "name": "Mdumezulu (Dvokodvweni)"
  },
  {
    "category": "Hhohho",
    "id": "252000_255000_505000_506000",
    "name": "Ndlalambi (Mayiwane)"
  },
  {
    "category": "Lubombo",
    "id": "467000_469000",
    "name": "Maloma (Sigwe)"
  },
  {
    "category": "Lubombo",
    "id": "367000",
    "name": "Maphungwane (Mpolonjeni)"
  },
  {
    "category": "Manzini",
    "id": "12000_140000",
    "name": "Mafutseni (Mafutseni)"
  },
  {
    "category": "Manzini",
    "id": "104000",
    "name": "Mgazini (Ngwempisi)"
  },
  {
    "category": "Shiselweni",
    "id": "287000_288000",
    "name": "Makhosini (Mbangweni)"
  },
  {
    "category": "Hhohho",
    "id": "158000",
    "name": "Ekupheleni (Motjane)"
  },
  {
    "category": "Shiselweni",
    "id": "240000_241000_242000",
    "name": "Mkhitsini (Mtsambama)"
  },
  {
    "category": "Manzini",
    "id": "109000",
    "name": "Lushikishini (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "103000_318000_319000",
    "name": "Mgazini (Ngwempisi)"
  },
  {
    "category": "Manzini",
    "id": "43000",
    "name": "Mbekelweni (Ludzeludze)"
  },
  {
    "category": "Shiselweni",
    "id": "326000_327000",
    "name": "Hluti (Hosea)"
  },
  {
    "category": "Hhohho",
    "id": "204000",
    "name": "Mgungundlovu (Ndzingeni)"
  },
  {
    "category": "Shiselweni",
    "id": "395000_508000_514000",
    "name": "Hlatikulu (Mtsambama)"
  },
  {
    "category": "Lubombo",
    "id": "420000",
    "name": "Shewula (Lomahasha)"
  },
  {
    "category": "Shiselweni",
    "id": "292000",
    "name": "Zombodze (Zombodze)"
  },
  {
    "category": "Manzini",
    "id": "125000",
    "name": "Mafutseni (Mafutseni)"
  },
  {
    "category": "Manzini",
    "id": "129000_130000",
    "name": "Ngculwini (Mafutseni)"
  },
  {
    "category": "Manzini",
    "id": "70000",
    "name": "Nkiliji (Kukhanyeni)"
  },
  {
    "category": "Shiselweni",
    "id": "306000_307000",
    "name": "Lulakeni (Sigwe)"
  },
  {
    "category": "Hhohho",
    "id": "6000_248000_462000_463000",
    "name": "Dvokolwako (Madlangampisi)"
  },
  {
    "category": "Shiselweni",
    "id": "454000_455000_456000",
    "name": "Lulakeni (Sigwe)"
  },
  {
    "category": "Shiselweni",
    "id": "335000_336000",
    "name": "Mahamba (Gege)"
  },
  {
    "category": "Lubombo",
    "id": "351000",
    "name": "Maphungwane (Mpolonjeni)"
  },
  {
    "category": "Manzini",
    "id": "32000_33000",
    "name": "Manzini (Ludzeludze)"
  },
  {
    "category": "Hhohho",
    "id": "156000_157000",
    "name": "Sigangeni (Motjane)"
  },
  {
    "category": "Lubombo",
    "id": "356000",
    "name": "Lubuli (Lubuli)"
  },
  {
    "category": "Lubombo",
    "id": "352000_353000_354000",
    "name": "Maphungwane (Mpolonjeni)"
  },
  {
    "category": "Hhohho",
    "id": "182000",
    "name": "Emvembili (Timpisini)"
  },
  {
    "category": "Manzini",
    "id": "48000",
    "name": "Maliyaduma (Kukhanyeni)"
  },
  {
    "category": "Shiselweni",
    "id": "295000",
    "name": "Makhosini (Maseyisini)"
  },
  {
    "category": "Shiselweni",
    "id": "305000",
    "name": "Ntjanini (Sigwe)"
  },
  {
    "category": "Manzini",
    "id": "137000_138000",
    "name": "Dvokolwako (Mkhiweni)"
  },
  {
    "category": "Lubombo",
    "id": "421000_515000",
    "name": "Mlawula (Lugongolweni)"
  },
  {
    "category": "Lubombo",
    "id": "489000",
    "name": "Bulunga (Siphofaneni)"
  },
  {
    "category": "Hhohho",
    "id": "143000_144000",
    "name": "Motjane (Pigg'S PEAK)"
  },
  {
    "category": "Manzini",
    "id": "25000_27000",
    "name": "Matsapha (Kwaluseni)"
  },
  {
    "category": "Hhohho",
    "id": "177000",
    "name": "Mondi (Pigg'S PEAK)"
  },
  {
    "category": "Lubombo",
    "id": "363000",
    "name": "Big- Bend (Nkilongo)"
  },
  {
    "category": "Lubombo",
    "id": "493000_494000",
    "name": "Sithobela (Kubuta)"
  },
  {
    "category": "Manzini",
    "id": "51000",
    "name": "Bethany (Mahlanya)"
  },
  {
    "category": "Lubombo",
    "id": "453000",
    "name": "Ka-Mamba (Sithobela)"
  },
  {
    "category": "Hhohho",
    "id": "446000",
    "name": "Mbabane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "102000",
    "name": "Lushikishini (Ngwempisi)"
  },
  {
    "category": "Hhohho",
    "id": "224000_225000",
    "name": "Malagwane (Mbabane)"
  },
  {
    "category": "Manzini",
    "id": "107000",
    "name": "Lundzi (Mangcongco)"
  },
  {
    "category": "Manzini",
    "id": "113000_114000",
    "name": "Ka-Khuphuka (Mkhiweni)"
  },
  {
    "category": "Manzini",
    "id": "16000_17000_18000",
    "name": "Manzini (Manzini)"
  },
  {
    "category": "Lubombo",
    "id": "349000",
    "name": "Maphungwane (Tikhuba)"
  },
  {
    "category": "Hhohho",
    "id": "164000_165000",
    "name": "Ejubukweni (Nkaba)"
  },
  {
    "category": "Lubombo",
    "id": "438000_464000",
    "name": "Lomahasha (Lomahasha)"
  }
]

function random_number_between(min, max) {
  return parseInt(Math.random() * (max - min) + min)
}

let form_data_types = [
  {
    "any_structures_unsprayed": "no",
    "number_of_structures_sprayed": 15,
    "number_structures_total": 15,
    "recorded_by": "2",
    "visit_type": "mopup",
  },
  // replace with different type
  {
    "any_structures_unsprayed": "no",
    "number_of_structures_sprayed": 15,
    "number_structures_total": 15,
    "recorded_by": "2",
    "visit_type": "mopup",
  }
]

let response = {
  "_id": faker.random.uuid(),
  "id": faker.random.uuid(),
  "country": "swz",
  "form_data": form_data_types[0],
  "location": {
    "coords": {
      "accuracy": faker.random.number(),
      "latitude": faker.address.latitude(),
      "longitude": faker.address.longitude()
    }
  },
  "location_selection": areas[random_number_between(0, areas.length -1)],
  "recorded_on": faker.date.recent(),
  "user": faker.name.firstName(),
  "userAgent": faker.internet.userAgent()
}

console.log(response)