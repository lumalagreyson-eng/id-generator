const express = require('express');
const bwipjs = require('bwip-js');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Official AAMVA Issuer Identification Number (IIN) Table for US Jurisdictions
const stateConfig = {
    'VA': { iin: '636000', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NY': { iin: '636001', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MA': { iin: '636002', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MD': { iin: '636003', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NC': { iin: '636004', version: '09', jurisdictionVersion: '00', entries: '02' },
    'SC': { iin: '636005', version: '09', jurisdictionVersion: '00', entries: '02' },
    'CT': { iin: '636006', version: '09', jurisdictionVersion: '00', entries: '02' },
    'LA': { iin: '636007', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MT': { iin: '636008', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NM': { iin: '636009', version: '09', jurisdictionVersion: '00', entries: '02' },
    'FL': { iin: '636010', version: '09', jurisdictionVersion: '00', entries: '02' },
    'DE': { iin: '636011', version: '09', jurisdictionVersion: '00', entries: '02' },
    'CA': { iin: '636014', version: '09', jurisdictionVersion: '00', entries: '02' },
    'TX': { iin: '636015', version: '09', jurisdictionVersion: '00', entries: '02' },
    'IA': { iin: '636018', version: '09', jurisdictionVersion: '00', entries: '02' },
    'CO': { iin: '636020', version: '09', jurisdictionVersion: '00', entries: '02' },
    'AR': { iin: '636021', version: '09', jurisdictionVersion: '00', entries: '02' },
    'KS': { iin: '636022', version: '09', jurisdictionVersion: '00', entries: '02' },
    'OH': { iin: '636023', version: '09', jurisdictionVersion: '00', entries: '02' },
    'VT': { iin: '636024', version: '09', jurisdictionVersion: '00', entries: '02' },
    'PA': { iin: '636025', version: '09', jurisdictionVersion: '00', entries: '02' },
    'AZ': { iin: '636026', version: '09', jurisdictionVersion: '00', entries: '02' },
    'OR': { iin: '636029', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MO': { iin: '636030', version: '09', jurisdictionVersion: '00', entries: '02' },
    'WI': { iin: '636031', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MI': { iin: '636032', version: '09', jurisdictionVersion: '00', entries: '02' },
    'AL': { iin: '636033', version: '09', jurisdictionVersion: '00', entries: '02' },
    'ND': { iin: '636034', version: '09', jurisdictionVersion: '00', entries: '02' },
    'IL': { iin: '636035', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NJ': { iin: '636036', version: '09', jurisdictionVersion: '00', entries: '02' },
    'IN': { iin: '636037', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MN': { iin: '636038', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NH': { iin: '636039', version: '09', jurisdictionVersion: '00', entries: '02' },
    'UT': { iin: '636040', version: '09', jurisdictionVersion: '00', entries: '02' },
    'ME': { iin: '636041', version: '09', jurisdictionVersion: '00', entries: '02' },
    'SD': { iin: '636042', version: '09', jurisdictionVersion: '00', entries: '02' },
    'DC': { iin: '636043', version: '09', jurisdictionVersion: '00', entries: '02' },
    'WA': { iin: '636045', version: '09', jurisdictionVersion: '00', entries: '02' },
    'KY': { iin: '636046', version: '09', jurisdictionVersion: '00', entries: '02' },
    'HI': { iin: '636047', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NV': { iin: '636049', version: '09', jurisdictionVersion: '00', entries: '02' },
    'ID': { iin: '636050', version: '09', jurisdictionVersion: '00', entries: '02' },
    'MS': { iin: '636051', version: '09', jurisdictionVersion: '00', entries: '02' },
    'RI': { iin: '636052', version: '09', jurisdictionVersion: '00', entries: '02' },
    'TN': { iin: '636053', version: '09', jurisdictionVersion: '00', entries: '02' },
    'NE': { iin: '636054', version: '09', jurisdictionVersion: '00', entries: '02' },
    'GA': { iin: '636055', version: '09', jurisdictionVersion: '00', entries: '02' },
    'OK': { iin: '636058', version: '09', jurisdictionVersion: '00', entries: '02' },
    'AK': { iin: '636059', version: '09', jurisdictionVersion: '00', entries: '02' },
    'WY': { iin: '636060', version: '09', jurisdictionVersion: '00', entries: '02' },
    'WV': { iin: '636061', version: '09', jurisdictionVersion: '00', entries: '02' },
    'VI': { iin: '636062', version: '09', jurisdictionVersion: '00', entries: '02' }
};

app.post('/generate-pdf417', (req, res) => {
    try {
        const selectedState = (req.body.targetState || 'TX').toUpperCase();
        const config = stateConfig[selectedState] || stateConfig['TX'];

        const { 
            daq, dac, dad, dcs, dcu, dca, dbd, dbb, dba, dbc, 
            dau, day, daw, daz, dcl, dag, dai, daj, dak, 
            dcf, dck, dcg, ddb, dcb, dcd 
        } = req.body;

        const fileType = "DL";
        const subfileOffset = "0041";

        // Smart formatting for DAU (inches format)
        const formattedDau = dau 
            ? (dau.toLowerCase().includes('in') ? dau.toLowerCase() : dau + ' in') 
            : '063 in';

        const subfileData = [
            `DCB${dcb || 'NONE'}`,
            `DCD${dcd || 'NONE'}`,
            `DBA${dba || ''}`,
            `DCS${dcs || ''}`,
            "DDEN",
            `DAC${dac || ''}`,
            "DDFN",
            `DAD${dad || ''}`,
            "DDGN",
            `DBD${dbd || '01012020'}`,
            `DBB${dbb || '01012000'}`,
            `DBC${dbc || '1'}`,
            `DAY${day || 'BLK'}`,
            `DAU${formattedDau}`,
            `DAG${dag || ''}`,
            `DAI${dai || ''}`,
            `DAJ${daj || selectedState}`,
            `DAK${dak || ''}`,
            `DAQ${daq || ''}`,
            `DCF${dcf || ''}`,
            `DCG${dcg || 'USA'}`,
            `DAZ${daz || 'BLK'}`,
            `DCK${dck || ''}`,
            `DCL${dcl || 'BKO'}`,
            `DDAF`,
            `DDB${ddb || '01012028'}`,
            `DAW${daw || ''}`,
            ``,
            `ZTZTAN`
        ].join('\r') + '\r';

        // Dynamically compute exact byte length for the subfile block
        const subfileLengthStr = String(subfileData.length).padStart(4, '0');

        const licenseClass = dca || 'C';
        const header = `@\n\x1e\rANSI ${config.iin}${config.version}${config.jurisdictionVersion}${config.entries}${fileType}${subfileOffset}${subfileLengthStr}ZT03150007${fileType}DCA${licenseClass}`;
        const rawData = header + '\r' + subfileData;

        bwipjs.toBuffer({
            bcid:        'pdf417',
            text:        rawData,
            scale:       3,
            height:      12,
            columns:     6,
            eclevel:     3,
            paddingx:    10,
            paddingy:    10,
        }, function (err, png) {
            if (err) {
                console.error("PDF417 Generation Error:", err);
                res.status(500).send(err.message);
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.send(png);
            }
        });
    } catch (e) {
        console.error("PDF417 Server Crash Error:", e);
        res.status(500).send(e.message);
    }
});

app.post('/generate-code128', (req, res) => {
    try {
        const { dck, daq } = req.body;
        const barcodeText = dck || daq || '123456789';

        bwipjs.toBuffer({
            bcid:        'code128',
            text:        barcodeText,
            scale:       3,
            height:      15,
            includetext: true,
            textxalign:  'center',
            paddingx:    10,
            paddingy:    10,
        }, function (err, png) {
            if (err) {
                console.error("Code128 Generation Error:", err);
                res.status(500).send(err.message);
            } else {
                res.setHeader('Content-Type', 'image/png');
                res.send(png);
            }
        });
    } catch (e) {
        console.error("Code128 Server Crash Error:", e);
        res.status(500).send(e.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
