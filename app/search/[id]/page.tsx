"use client";

import Results from "@/components/Results";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";
import Spinner from "react-spinkit";

type Props = {
  params: {
    id: string;
  };
};

function SearchPage({ params: { id } }: Props) {
  const [snapshot, loading, error] = useDocument(doc(db, "searches", id));
  const router = useRouter();

  const handleDelete = () => {
    deleteDoc(doc(db, "searches", id));
    router.push("/");
  };

  const deleteButton = (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded-lg"
      onClick={handleDelete}
    >
      Delete Search
    </button>
  );

  if (loading)
    return (
      <h1 className="text-center p-10 animate-pulse text-xl text-red-600/50">
        Loading results...
      </h1>
    );

  if (!snapshot?.exists()) return;

  if (snapshot.data()?.status === "pending")
    return (
      <div className="flex flex-col gap-y-5 py-10 items-center justify-between">
        <p className="text-red-600 animate-pulse text-center">
          Scraping results from Amazon...
        </p>

        <Spinner
          style={{
            height: "60px",
            width: "60px",
          }}
          name="ball-grid-pulse"
          fadeIn="none"
          color="coral"
        />

        {deleteButton}
      </div>
    );

  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-7">
        <div className="flex flex-col md:flex-row gap-x-4">
          <h1 className="font-bolg">
            Search results for{" "}
            <span className="text-red-600">{snapshot.data()?.search} </span>
            <span className="text-black/50">
              –{" "}
              {snapshot.data()?.results?.length > 0 &&
                `${snapshot.data()?.results?.length} results found`}
            </span>
          </h1>
        </div>

        {deleteButton}
      </div>

      {snapshot.data()?.results?.length > 0 && (
        <Results results={snapshot.data()?.results} />
      )}
    </div>
  );
}

export default SearchPage;
