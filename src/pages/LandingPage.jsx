import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import heroImage from "../assets/landing-icon.svg";
import medal from "../assets/medal-icon.svg";
import clan from "../assets/clan.svg";
import background from "../assets/landing-background.svg";
import book from "../assets/book.svg";
import trophy from "../assets/trophy.svg";
import clanFeature from "../assets/clan-feature.svg";

import Button from "../components/Button";

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7 },
  viewport: { once: true }
};

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center gap-32 px-6 md:px-10 py-16">

      <motion.div
        {...fadeUp}
        className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-16"
      >
        <div className="flex-1 flex justify-center">
          <img
            src={heroImage}
            className="w-64 md:w-96 drop-shadow-xl hover:scale-105 transition"
          />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-6">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold leading-snug">
            Belajar memahami informasi
            <br />
            dengan lebih cerdas
          </h1>

          <p className="text-gray-300 max-w-md">
            Latih kemampuan membaca kritis dan memahami informasi secara tepat melalui pengalaman belajar yang interaktif dan menyenangkan.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate("/register")}
              className="hover:scale-110 transition"
            >
              Mulai belajar
            </Button>

            <Button
              onClick={() => navigate("/login")}
              variant="secondary"
              className="hover:scale-110 transition"
            >
              Aku sudah punya akun
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-16"
      >
        <div className="flex-1 flex flex-col items-center md:items-start md:pl-20 text-center md:text-left gap-5 max-w-md">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Belajar sambil bermain
          </h2>

          <p className="text-gray-300">
            Kumpulkan poin dan tingkatkan kemampuan literasi informasimu melalui sistem pembelajaran berbasis gamifikasi yang menyenangkan.
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={medal}
            className="w-48 md:w-72 opacity-90 hover:scale-105 transition"
          />
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="flex flex-col md:flex-row items-center justify-between max-w-6xl w-full gap-16"
      >
        <div className="flex-1 flex justify-center">
          <img
            src={clan}
            className="w-48 md:w-72 opacity-90 hover:scale-105 transition"
          />
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start md:pr-20 text-center md:text-left gap-5 max-w-md">
          <h2 className="font-display text-2xl md:text-3xl font-bold">
            Belajar bersama
          </h2>

          <p className="text-gray-300">
            Tingkatkan kemampuan literasimu bersama teman dan naikkan peringkat bersama klan.
          </p>
        </div>
      </motion.div>

      <motion.div
        {...fadeUp}
        className="max-w-6xl w-full flex flex-col gap-16"
      >
        <h2 className="font-display text-3xl font-bold text-center">
          Belajar dengan Gatra
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white/5 hover:bg-white/10 transition p-6 rounded-xl flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Kuis</h3>

            <p className="text-gray-300 text-sm">
              Setelah membaca teks, uji kemampuan kamu melalui kuis yang dirancang untuk melatih berpikir kritis.
            </p>

            <img
              src={book}
              className="w-40 self-center hover:scale-105 transition"
              alt="Quiz feature"
            />
          </div>

          <div className="bg-white/5 hover:bg-white/10 transition p-6 rounded-xl flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Achievement</h3>

            <p className="text-gray-300 text-sm">
              Kumpulkan berbagai achievement sebagai bentuk pencapaian dari pembelajaran yang kamu lakukan.
            </p>

            <img
              src={trophy}
              className="w-40 self-center hover:scale-105 transition"
            />
          </div>

          <div className="bg-white/5 hover:bg-white/10 transition p-6 rounded-xl flex flex-col gap-3">
            <h3 className="font-semibold text-lg">Klan</h3>

            <p className="text-gray-300 text-sm">
              Bergabunglah dengan klan untuk belajar bersama dan meningkatkan kemampuan literasi serta bersaing dengan klan lain.
            </p>

            <img
              src={clanFeature}
              className="w-40 self-center hover:scale-105 transition"
            />
          </div>

        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="w-full py-24 flex justify-center relative"
      >

        <img
          src={background}
          className="absolute w-175 opacity-30 left-1/2 -translate-x-1/2 -top-10"
          alt=""
        />

        <div className="max-w-6xl px-6 flex flex-col items-center gap-6 text-center relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Siap belajar?
          </h2>

          <Button
            onClick={() => navigate("/register")}
            className="hover:scale-110 transition text-lg px-8 py-3"
          >
            Buat akun sekarang
          </Button>
        </div>
      </motion.div>

    </div>
  );
};

export default LandingPage;