
import { getScopedI18n } from "@/locales/server";

export default async function TermsOfServicePage() {

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
            <h1 className="text-4xl font-bold mb-6 font-headline">Términos de Servicio</h1>
            <p className="text-muted-foreground mb-8">Última actualización: 10 de Octubre de 2024</p>
            
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">1. Aceptación de los Términos</h2>
                    <p className="text-muted-foreground">
                        Al acceder y utilizar los servicios de NexAI, usted acepta y se compromete a cumplir con estos Términos de Servicio. Si no está de acuerdo con estos términos, no debe utilizar nuestros servicios.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">2. Descripción del Servicio</h2>
                    <p className="text-muted-foreground">
                        NexAI proporciona una plataforma para agendar citas, interactuar con un asistente de inteligencia artificial y gestionar la configuración de una página web personalizable. Los servicios están destinados a facilitar la comunicación y la organización.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">3. Uso Aceptable</h2>
                    <p className="text-muted-foreground">
                        Usted se compromete a no utilizar los servicios para ningún propósito ilegal o no autorizado. Se prohíbe el uso de los servicios de una manera que pueda dañar, deshabilitar, sobrecargar o perjudicar nuestros servidores o redes. No debe intentar obtener acceso no autorizado a ninguna parte de los servicios.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">4. Propiedad Intelectual</h2>
                    <p className="text-muted-foreground">
                        El servicio y su contenido original, características y funcionalidades son y seguirán siendo propiedad exclusiva de NexAI y sus licenciantes.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">5. Interacciones con IA</h2>
                    <p className="text-muted-foreground">
                        Al utilizar el chatbot de IA, usted comprende que las respuestas son generadas por un modelo de lenguaje y pueden no ser siempre precisas. No debe compartir información sensible o personal que no desee que sea procesada por sistemas de terceros.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">6. Limitación de Responsabilidad</h2>
                    <p className="text-muted-foreground">
                        En ningún caso NexAI, ni sus directores, empleados o afiliados, serán responsables de ningún daño indirecto, incidental, especial, consecuente o punitivo que resulte de su acceso o uso del servicio.
                    </p>
                </div>

                 <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">7. Cambios en los Términos</h2>
                    <p className="text-muted-foreground">
                        Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Le notificaremos sobre cualquier cambio publicando los nuevos términos en esta página.
                    </p>
                </div>
            </div>
        </div>
    );
}
