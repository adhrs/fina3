import React, { useState } from 'react';
import { AdminData, Asset } from '../../types/admin';

interface Step3Props {
  onNext: (assetBox: Asset[]) => void;
  onSkip: () => void;
  onBack: () => void;
  adminData: AdminData;
  updateAdminData: (data: Partial<AdminData>) => void;
}

const MAX_ASSETS = 2;

export const Step3: React.FC<Step3Props> = ({ 
  onNext, 
  onSkip, 
  onBack, 
  adminData, 
  updateAdminData 
}) => {
  const [assetBox, setAssetBox] = useState<Asset[]>(adminData.assetBox || []);

  const handleAddAsset = () => {
    if (assetBox.length < MAX_ASSETS) {
      const newAsset: Asset = {
        id: crypto.randomUUID(),
        type: 'company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setAssetBox([...assetBox, newAsset]);
    }
  };

  const handleRemoveAsset = (index: number) => {
    setAssetBox(assetBox.filter((_, i) => i !== index));
  };

  const handleAssetChange = (index: number, field: keyof Asset, value: string) => {
    const updatedAssets = [...assetBox];
    updatedAssets[index] = { 
      ...updatedAssets[index], 
      [field]: value,
      updatedAt: new Date().toISOString()
    } as Asset;
    setAssetBox(updatedAssets);
    updateAdminData({ assetBox: updatedAssets });
  };

  const isFormValid = () => {
    return assetBox.every(asset => {
      if (asset.type === 'company') {
        return asset.name && asset.companyType && asset.country;
      } else if (asset.type === 'personal') {
        if (asset.assetType === 'Real estate') {
          return asset.realEstateType && asset.realEstateName && asset.country;
        } else if (asset.assetType === 'Other asset') {
          return asset.otherAssetType && asset.otherAssetName && asset.country;
        }
      }
      return false;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(assetBox);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Assets</h2>
            <p className="mt-2 text-sm text-gray-600">
              Add up to {MAX_ASSETS} assets or skip this step.
            </p>
          </div>

          {assetBox.length === 0 ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleAddAsset}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Asset
              </button>
              <button
                type="button"
                onClick={onSkip}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={onBack}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {assetBox.map((asset, index) => (
                <div key={asset.id} className="bg-gray-50 p-4 rounded-lg relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveAsset(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                      <div className="mt-2 space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="company"
                            checked={asset.type === 'company'}
                            onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Company</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            value="personal"
                            checked={asset.type === 'personal'}
                            onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2">Personal Asset</span>
                        </label>
                      </div>
                    </div>

                    {asset.type === 'company' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Name</label>
                          <input
                            type="text"
                            value={asset.name || ''}
                            onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Company Type</label>
                          <select
                            value={asset.companyType || ''}
                            onChange={(e) => handleAssetChange(index, 'companyType', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select type...</option>
                            <option value="Einzelunternehmen">Einzelunternehmen</option>
                            <option value="Personengesellschaft">Personengesellschaft</option>
                            <option value="KG">KG and other mixed entities</option>
                            <option value="Kapitalgesellschaft">Kapitalgesellschaft</option>
                            <option value="Stiftungen">Stiftungen</option>
                          </select>
                        </div>
                      </>
                    )}

                    {asset.type === 'personal' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                          <select
                            value={asset.assetType || ''}
                            onChange={(e) => handleAssetChange(index, 'assetType', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select type...</option>
                            <option value="Real estate">Real Estate</option>
                            <option value="Other asset">Other Asset</option>
                          </select>
                        </div>

                        {asset.assetType === 'Real estate' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Real Estate Type</label>
                              <select
                                value={asset.realEstateType || ''}
                                onChange={(e) => handleAssetChange(index, 'realEstateType', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              >
                                <option value="">Select type...</option>
                                <option value="Personal Residence">Personal Residence</option>
                                <option value="Investment Property">Investment Property</option>
                                <option value="Commercial">Commercial</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Property Name/Address</label>
                              <input
                                type="text"
                                value={asset.realEstateName || ''}
                                onChange={(e) => handleAssetChange(index, 'realEstateName', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </>
                        )}

                        {asset.assetType === 'Other asset' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Other Asset Type</label>
                              <select
                                value={asset.otherAssetType || ''}
                                onChange={(e) => handleAssetChange(index, 'otherAssetType', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              >
                                <option value="">Select type...</option>
                                <option value="Portable goods">Portable Goods</option>
                                <option value="Rights and Licenses">Rights and Licenses</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                              <input
                                type="text"
                                value={asset.otherAssetName || ''}
                                onChange={(e) => handleAssetChange(index, 'otherAssetName', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        value={asset.country || ''}
                        onChange={(e) => handleAssetChange(index, 'country', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {assetBox.length < MAX_ASSETS && (
                <button
                  type="button"
                  onClick={handleAddAsset}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Another Asset
                </button>
              )}

              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={onSkip}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};