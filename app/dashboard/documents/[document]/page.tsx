


export default async function DocumentPage({ params }:{params:Promise<{document:string}>}) {
    const {document} = await params;
    // const {decoded} = await getAuth();

    // const documentData = await prisma.document.findUnique({
    //     where: { id: document },
    // });

    return <div>
        <h1>{document}</h1>
    </div>
}