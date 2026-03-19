import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getTokenConfigApi,
  updateTokenConfigApi,
} from "../api/TokenAPIs";

const TokenConfig = () => {
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
        alert("Config Updated Successfully ✅");
      } else {
        alert("Update Failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-app">
      <Sidebar />

      <div className="content">
        <Header title="Token Config" />

        <main className="container-fluid mt-4">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-8">

              <div className="card shadow-sm">
                <div className="card-body p-4">

                  <h5 className="mb-4">Token Configuration</h5>

                  <form onSubmit={handleSubmit}>

                    {/* Daily Free Limit */}
                    <div className="mb-3">
                      <label className="form-label">
                        Daily Free Limit
                      </label>
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
                        Number of free actions per day
                      </small>
                    </div>

                    {/* Ad Reward Tokens */}
                    <div className="mb-3">
                      <label className="form-label">
                        Ad Reward Tokens
                      </label>
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
                        Tokens earned after watching an ad
                      </small>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save Config"}
                    </button>

                  </form>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TokenConfig;