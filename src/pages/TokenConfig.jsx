import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTokenConfigApi, updateTokenConfigApi } from "../api/TokenAPIs";

const TokenConfig = () => {
  const { t } = useTranslation();
  const [config, setConfig] = useState({
    daily_free_limit: 0,
    ad_reward_tokens: 0,
  });

  const [loading, setLoading] = useState(false);

  // ✅ GET Config
  const getConfig = async () => {
    try {
      const res = await getTokenConfigApi();

      if (res.data?.status === 1) {
        setConfig(res.data.config);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getConfig();
  }, []);

  // ✅ Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setConfig({
      ...config,
      [name]: Number(value),
    });
  };

  // ✅ UPDATE Config
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateTokenConfigApi(config);

      if (res.data?.status === 1) {
        alert(t("tokenConfig.updateSuccess"));
      } else {
        alert(t("tokenConfig.updateFailed"));
      }
    } catch (err) {
      console.error(err);
      alert(t("tokenConfig.errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <main className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card shadow-sm">
              <div className="card-body p-4">
                <h5 className="mb-4">{t("tokenConfig.title")}</h5>

                <form onSubmit={handleSubmit}>
                  {/* Daily Free Limit */}
                  <div className="mb-3">
                    <label className="form-label">{t("tokenConfig.dailyFreeLimit")}</label>
                    <input
                      type="number"
                      name="daily_free_limit"
                      className="form-control"
                      value={config.daily_free_limit}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                    <small className="text-muted">
                      {t("tokenConfig.dailyFreeDesc")}
                    </small>
                  </div>

                  {/* Ad Reward Tokens */}
                  <div className="mb-3">
                    <label className="form-label">{t("tokenConfig.adRewardTokens")}</label>
                    <input
                      type="number"
                      name="ad_reward_tokens"
                      className="form-control"
                      value={config.ad_reward_tokens}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                    <small className="text-muted">
                      {t("tokenConfig.adRewardDesc")}
                    </small>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                  >
                    {loading ? t("tokenConfig.saving") : t("tokenConfig.saveConfig")}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TokenConfig;
