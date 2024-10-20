import React, { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import ClientLayout from "../../layout/client";
import {
  HomePage,
  SwapDrc20,
  SwapNFT,
  AirdropDRC20Page,
  AirdropNFTPage,
  RoadmapPage,
} from "../../page/client";
import { getPrivateKeyFromLocalStorage } from "../../config/wallet";
import { walletExist } from "../../redux/walletSlice";
import { SERVER_URL } from "../../config/constants";
import { updateCoinPrice } from "../../redux/informationSlice";

const ClientVIew = () => {
  const dispatch = useDispatch();

  const informationUpdate = async () => {
    try {
      const result_armz_price = await axios.get(
        `${SERVER_URL}/api/information/armzprice`
      );
      const result_dogecoin_price = await axios.get(
        `${SERVER_URL}/api/information/dogecoinprice`
      );

      const armzPrice = result_armz_price.data.data.armzPrice;
      const dogecoinPrice = result_dogecoin_price.data.data.dogecoinPrice;

      dispatch(
        updateCoinPrice({
          armzPrice: armzPrice,
          dogecoinPrice: dogecoinPrice,
        })
      );
      // console.log("Armz:", armzPrice);
      // console.log("Doge:", dogecoinPrice);
    } catch (err) {
      throw err;
    }
  };
  useEffect(() => {
    const privateKey = getPrivateKeyFromLocalStorage();
    if (privateKey !== undefined) dispatch(walletExist());

    informationUpdate();
    const timerId = setInterval(informationUpdate, 60000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="/swap"
            element={<Navigate to="/swap/swap-drc20" replace={true} />}
          />
          <Route path="/swap/swap-drc20" element={<SwapDrc20 />} />
          <Route path="/swap/swap-nft" element={<SwapNFT />} />
          {/* <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/dao" element={<DAOGovernancePage />} /> */}
          <Route
            path="/airdrop"
            element={<Navigate to="/airdrop/airdrop-drc20" replace={true} />}
          />
          <Route path="/airdrop/airdrop-drc20" element={<AirdropDRC20Page />} />
          <Route path="/airdrop/airdrop-nft" element={<AirdropNFTPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default ClientVIew;
