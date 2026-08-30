import { redirect } from "next/navigation";

// Bu rota eski bir şablon kalıntısıydı (misafir verilerini girişsiz gösteriyordu).
// Site yönetimi /alperduygu altında, giriş korumalı.
export default function AdminPage() {
  redirect("/");
}
