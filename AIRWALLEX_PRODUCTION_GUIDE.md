# Airwallex Production API Integration Guide

## Current Status ✅
- **Account ID**: [يتم تحديثه من API مباشرة]
- **Subject ID**: [يتم تحديثه من API مباشرة]
- **API Keys**: Working (authentication successful)
- **Base URL**: `https://api.airwallex.com/api/v1/` (Production)
- **Issue**: Issuing API not enabled (403 access_denied_not_enabled)

## Next Steps Required

### 1. Contact Airwallex Account Manager
To enable Card Issuing APIs, contact your Airwallex Account Manager to activate:
- **Cards Product** access
- **Issuing APIs** permissions
- **Required Configuration**

**Contact Information:**
- Account Manager through Airwallex web app
- Support: https://www.airwallex.com/support
- Developer docs: https://www.airwallex.com/docs/issuing__integration-checklist

### 2. Production Requirements Checklist

#### Account Setup:
- [ ] Complete onboarding obligations
- [ ] Ensure account is active and verified
- [ ] Add sufficient funds to Airwallex Wallet
- [ ] Enable Cards product through Account Manager

#### API Configuration:
- [x] Generate production API keys (completed)
- [x] Update base URLs to production (completed)
- [x] Configure authentication flow (completed)
- [ ] Enable Issuing API permissions (pending)

#### Testing Requirements:
- [ ] Test card creation with nominal amounts
- [ ] Configure production webhooks
- [ ] Verify cardholder creation flow
- [ ] Test authorization controls

### 3. API Key Information

**Current Keys:**
- **Client ID**: Available in environment
- **API Key**: Available in environment
- **Environment**: Production (api.airwallex.com)

**Key Management:**
- Keys are stored securely in environment variables
- Follow principle of least privilege
- Regenerate if compromised

### 4. Expected Capabilities After Enablement

#### Card Issuing Features:
- Virtual and physical multi-currency cards
- Real-time authorization controls
- Instant card creation/cancellation
- Global coverage via Visa network (200+ countries)
- Multi-currency wallet integration

#### Supported Operations:
- Create cardholders
- Issue cards (virtual/physical)
- Manage card status (activate/freeze/cancel)
- Set spending limits
- Track transactions
- Configure webhooks

### 5. Integration Flow

#### Current Implementation:
1. **Authentication**: ✅ Working
2. **Account Info**: ✅ Working
3. **Cardholder Creation**: ❌ Needs API enablement
4. **Card Management**: ❌ Needs API enablement
5. **Transaction Tracking**: ❌ Needs API enablement

#### Post-Enablement Testing:
1. Test cardholder creation with real data
2. Issue test cards with small limits
3. Verify authorization flow
4. Test webhook notifications
5. Validate transaction tracking

## Error Messages Guide

### 403 access_denied_not_enabled
**Meaning**: API access for Issuing endpoints is disabled
**Solution**: Contact Account Manager to enable Issuing API

### 401 authentication_failed
**Meaning**: Invalid API credentials
**Solution**: Check CLIENT_ID and API_KEY in environment

### 400 invalid_request
**Meaning**: Request format or data validation error
**Solution**: Check request payload against API documentation

## Support Resources

- **API Documentation**: https://www.airwallex.com/docs/api
- **Integration Checklist**: https://www.airwallex.com/docs/issuing__integration-checklist
- **Developer Support**: Available through Airwallex web app
- **API Reference**: https://www.airwallex.com/docs/api?v=2025-06-16

## Test Environment vs Production

### Demo Environment:
- **URL**: https://demo.airwallex.com/app/account/apiKeys
- **Purpose**: Testing and development
- **API Base**: https://api-demo.airwallex.com/api/v1/

### Production Environment:
- **URL**: https://www.airwallex.com/app/account/apiKeys
- **Purpose**: Live transactions
- **API Base**: https://api.airwallex.com/api/v1/

## Security Best Practices

1. **API Key Storage**: Use environment variables
2. **Access Control**: Implement proper authentication
3. **Rate Limits**: 2,000 TPS per account/IP
4. **PCI Compliance**: Handled by Airwallex
5. **Token Management**: Implement token refresh logic

---

**Last Updated**: July 15, 2025
**Account ID**: 40bfd6db-4084-49e0-83e8-633db039ee74
**Status**: Awaiting Issuing API enablement