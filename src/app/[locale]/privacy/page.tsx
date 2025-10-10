
import { getScopedI18n } from "@/locales/server";

export default async function PrivacyPolicyPage() {

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-3xl">
            <h1 className="text-4xl font-bold mb-6 font-headline">Política de Privacidad</h1>
            <p className="text-muted-foreground mb-8">Última actualización: 10 de Octubre de 2024</p>
            
            <div className="space-y-8">
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">1. Introducción</h2>
                    <p className="text-muted-foreground">
                        Bienvenido a NexAI. Nos comprometemos a proteger su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos su información cuando utiliza nuestra aplicación y servicios.
                    </p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">2. Información que Recopilamos</h2>
                    <p className="text-muted-foreground">
                        Podemos recopilar información sobre usted de varias maneras. La información que podemos recopilar incluye:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>
                            <strong>Datos Personales:</strong> Información de identificación personal, como su nombre y dirección de correo electrónico, que nos proporciona voluntariamente al agendar una cita o al contactarnos.
                        </li>
                        <li>
                            <strong>Datos de Conversación:</strong> Las conversaciones que tiene con nuestro chatbot de IA se procesan para brindarle respuestas. No almacenamos estas conversaciones a largo plazo con fines de identificación personal.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">3. Uso de su Información</h2>
                    <p className="text-muted-foreground">
                        Tener información precisa sobre usted nos permite brindarle una experiencia fluida, eficiente y personalizada. Específicamente, podemos usar la información recopilada sobre usted para:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>Gestionar su cuenta y citas.</li>
                        <li>Enviarle un correo electrónico de confirmación o cancelación de citas.</li>
                        <li>Responder a sus solicitudes de productos y servicios al cliente.</li>
                        <li>Mejorar la calidad de nuestro servicio a través de las interacciones con la IA.</li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">4. Divulgación de su Información</h2>
                    <p className="text-muted-foreground">
                        No compartiremos su información personal con terceros, excepto en los siguientes casos:
                    </p>
                     <ul className="list-disc list-inside text-muted-foreground space-y-2">
                        <li>
                            <strong>Con Proveedores de IA:</strong> Para potenciar nuestro chatbot, las conversaciones se envían a proveedores de modelos de lenguaje grandes (como Google a través de Genkit). Estos datos se utilizan para generar respuestas y están sujetos a las políticas de privacidad de dichos proveedores.
                        </li>
                        <li>
                            <strong>Por Ley o para Proteger Derechos:</strong> Si creemos que la divulgación es necesaria para responder a un proceso legal, para investigar o remediar posibles violaciones de nuestras políticas, o para proteger los derechos, la propiedad y la seguridad de otros.
                        </li>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">5. Seguridad de su Información</h2>
                    <p className="text-muted-foreground">
                        Utilizamos medidas de seguridad administrativas, técnicas y físicas para ayudar a proteger su información personal. Si bien hemos tomado medidas razonables para asegurar la información personal que nos proporciona, tenga en cuenta que a pesar de nuestros esfuerzos, ninguna medida de seguridad es perfecta o impenetrable.
                    </p>
                </div>
                 <div className="space-y-4">
                    <h2 className="text-2xl font-semibold font-headline">6. Contáctenos</h2>
                    <p className="text-muted-foreground">
                        Si tiene preguntas o comentarios sobre esta Política de Privacidad, por favor contáctenos a través de nuestro formulario de contacto en el sitio web.
                    </p>
                </div>
            </div>
        </div>
    );
}
