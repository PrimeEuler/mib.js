mib.js
======

MIB (management information base) conversion to javascript

Component of:
* [NMS.js](https://github.com/PrimeEuler/NMS.js)

ToDo:
* Parse with [marked](https://github.com/chjj/marked)



### EXAMPLE mib2json.js :
``` 
var MIB = require('./lib/mib');

var mib = new MIB();
mib.LoadMIBs();
/*  _______mib.LoadMIBs();______
 *	Load MIB modules from 
 *	the RFC_BASE_MINIMUM folder.
 *
 *	CONSOLE LOG:
 *	Loading modules...
 *	Compiling modules...
 *	READY
 _______________________________*/


mib.WriteToFile('mib.JSON');
/*  _mib.WriteToFile('mib.JSON')_
 *	Save JSON compiled MIB modules 
 *  to the RFC_BASE_MINIMUM folder.
 *
 *
 *	CONSOLE LOG:
 *	The file was saved!
 _______________________________*/




/*  ___snmp-native varbind parsing____*/
var snmp = require('snmp-native');
var session = new snmp.Session();
var oid = 'system'
mib.GetObject(oid, function (Object) {
	var options = {
		host: '127.0.0.1',
		community: 'public',
		oid: '.' + Object.OID,
		timeouts: [5000]
	};
	session.getSubtree(options, function (error, varbinds, baseOid) {
		var NameSpaceTable = {};
		mib.DecodeVarBinds(varbinds, function (VarBinds) {
			var NameSpace = {};
			VarBinds.forEach(function (vb) {
				if (!NameSpace[vb.NameSpace]) {
					NameSpace[vb.NameSpace] = {};
				}
				NameSpace[vb.NameSpace][vb.oid] = vb.Value;
			});
			NameSpaceTable = delimiter2bracket(NameSpace, '.');
			console.log(JSON.stringify(NameSpaceTable, null, 4))

			/*
			{
				"iso": {
					"org": {
						"dod": {
							"internet": {
								"mgmt": {
									"mib-2": {
										"system": {
											"sysDescr": {
												"0": "Hardware: Intel64 Family 6 Model 58 Stepping 9 AT/AT COMPATIBLE 
												- Software: Windows Version 6.2 (Build 9200 Multiprocessor Free)"
											},
											"sysObjectID": {
												"0": "enterprises"
											},
											"sysUpTime": {
												"0": 24678860
											},
											"sysContact": {
												"0": "Jeremy Ebert"
											},
											"sysName": {
												"0": "DevPC"
											},
											"sysLocation": {
												"0": "Everywhere"
											},
											"sysServices": {
												"0": 79
											}
										}
									}
								}
							}
						}
					}
				}
			}
			*/




		});
	});

});
var delimiter2bracket = function (json, delimiter) {
	/*  ____________________________
	 *	Convert a delimeted Object to JSON 
	    ____________________________*/
	var bracket = {}, t, parts, part;
	for (var k in json) {
		t = bracket;
		parts = k.split(delimiter);

		var key = parts.pop(); //last part

		while (parts.length) {
			part = parts.shift(); //first part
			t = t[part] = t[part] || {};
		}
		t[key] = json[k];//set value
	}
	return bracket;
}
'''

