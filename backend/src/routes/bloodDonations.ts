import express from 'express';

const router = express.Router();

// Interface for the MDA API request
interface BloodDonationRequest {
  RequestHeader: {
    Application: number;
    Module: string;
    Function: string;
    Token: string;
  };
  RequestData: string;
}

interface BloodDonationResponse {
  Result: string;
  Success: boolean;
  ErrorCode: string | null;
  ErrorMsg: string | null;
}

// Proxy endpoint for MDA blood donations API
router.post('/', async (req, res) => {
  try {
    const requestPayload: BloodDonationRequest = {
      RequestHeader: {
        Application: 101,
        Module: "BloodBank",
        Function: "GetAllDetailsDonations",
        Token: ""
      },
      RequestData: ""
    };

    console.log('🩸 Proxying request to MDA API...');
    console.log('📤 Request payload:', JSON.stringify(requestPayload, null, 2));

    const response = await globalThis.fetch('https://www.mdais.org/umbraco/api/invoker/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; BloodDonationsApp/1.0)',
        'Accept': 'application/json',
        'Host': 'www.mdais.org',
        'referer': 'https://www.mdais.org/blood-donation',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📥 MDA API Response Status:', response.status);
    // console.log('📥 MDA API Response Headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`MDA API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as BloodDonationResponse;
    console.log('✅ Successfully received data from MDA API');
    
    const donations = JSON.parse(data.Result);
    res.json({
      success: true,
      data: donations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error proxying to MDA API:', error);
    
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    });
  }
});

// Health check for this specific route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Blood Donations Proxy',
    timestamp: new Date().toISOString() 
  });
});

export { router as bloodDonationsRouter };
